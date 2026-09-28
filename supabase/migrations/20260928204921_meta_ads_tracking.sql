-- FlowState marketing tracking. Additive: existing portal tables are preserved.
create table public.mkt_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.mkt_members enable row level security;
revoke all on public.mkt_members from anon, authenticated;
grant select on public.mkt_members to authenticated;
grant all on public.mkt_members to service_role;
create policy mkt_member_self on public.mkt_members for select to authenticated using (user_id = (select auth.uid()));

create table public.mkt_accounts (
  id text primary key, name text, currency text, timezone text, synced_at timestamptz
);
create table public.mkt_ads (
  id text primary key, account_id text references public.mkt_accounts(id), name text not null,
  status text, campaign_id text, campaign_name text, adset_id text, adset_name text,
  creative_id text, headline text, body text, destination_url text, url_tags text,
  video_id text, video_length numeric, format text, topic text, objection text, hook text,
  notes text, created_at timestamptz, first_seen_at timestamptz default now(), synced_at timestamptz
);
create table public.mkt_ad_daily (
  ad_id text references public.mkt_ads(id), date date, spend numeric,
  impressions bigint, link_clicks bigint, outbound_clicks bigint, landing_page_views bigint,
  video_plays bigint, video_3s bigint, thruplays bigint, average_watch_seconds numeric,
  p25 bigint, p50 bigint, p75 bigint, p95 bigint, p100 bigint,
  meta_leads bigint, meta_bookings bigint, attribution_setting text, raw_metrics jsonb,
  synced_at timestamptz default now(), primary key (ad_id,date)
);
create table public.mkt_ad_breakdowns (
  ad_id text references public.mkt_ads(id), date date, dimension text, segment text,
  spend numeric, impressions bigint, link_clicks bigint, synced_at timestamptz default now(),
  primary key(ad_id,date,dimension,segment)
);
create table public.mkt_leads (
  id uuid primary key default gen_random_uuid(), email text unique not null check(email=lower(email)),
  name text, phone text, company text,
  customer_type text default 'unknown' check(customer_type in ('unknown','electrical_owner','other_trade_owner','employee_apprentice','other')),
  classification_source text, qualification text default 'unknown' check(qualification in ('unknown','qualified','unqualified')),
  source_ad_id text, attribution_evidence text default 'unknown', tracking jsonb default '{}'::jsonb,
  first_seen_at timestamptz default now(), form_submitted_at timestamptz,
  notion_page_id text unique, crm_stage text, lost_reason text,
  call_outcome text default 'unknown' check(call_outcome in ('unknown','attended','no_show')),
  sale_outcome text default 'unknown' check(sale_outcome in ('unknown','won','lost')),
  sale_value numeric check(sale_value >= 0), notes text, synced_at timestamptz default now()
);
create index mkt_leads_source_ad_idx on public.mkt_leads(source_ad_id);
create table public.mkt_bookings (
  id text primary key, lead_id uuid references public.mkt_leads(id),
  event_uri text, status text, start_at timestamptz, end_at timestamptz,
  canceled_at timestamptz, synced_at timestamptz default now()
);
create index mkt_bookings_lead_idx on public.mkt_bookings(lead_id);
create table public.mkt_sync_runs (
  id uuid primary key default gen_random_uuid(), source text not null,
  status text check(status in ('running','success','partial','failed')), started_at timestamptz default now(),
  finished_at timestamptz, counts jsonb default '{}'::jsonb, error text
);
create table public.mkt_sync_state (
  source text primary key, lease_until timestamptz, last_success_at timestamptz
);

do $$ declare t text; begin
  foreach t in array array['mkt_accounts','mkt_ads','mkt_ad_daily','mkt_ad_breakdowns','mkt_leads','mkt_bookings','mkt_sync_runs','mkt_sync_state'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon, authenticated',t);
    execute format('grant all on public.%I to service_role',t);
    execute format('grant select on public.%I to authenticated',t);
    execute format('create policy mkt_owner_read on public.%I for select to authenticated using (exists (select 1 from public.mkt_members where user_id=(select auth.uid())))',t);
  end loop;
end $$;

-- Each sync claims a short lease. Avoid overlapping scheduled/manual runs.
create function public.mkt_claim_sync(p_source text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare n int; begin
  insert into public.mkt_sync_state(source,lease_until) values(p_source,now()+interval '5 minutes')
  on conflict(source) do update set lease_until=excluded.lease_until
  where public.mkt_sync_state.lease_until is null or public.mkt_sync_state.lease_until<now();
  get diagnostics n=row_count; return n>0;
end $$;
revoke all on function public.mkt_claim_sync(text) from public,anon,authenticated;
grant execute on function public.mkt_claim_sync(text) to service_role;

-- Vault helpers have server-only EXECUTE permissions and fixed names/search paths.
create function public.mkt_config() returns jsonb language sql security definer set search_path='' as $$
  select coalesce((select decrypted_secret::jsonb from vault.decrypted_secrets where name='flowstate_marketing_config'),'{}'::jsonb);
$$;
revoke all on function public.mkt_config() from public,anon,authenticated;
grant execute on function public.mkt_config() to service_role;
create function public.mkt_set_config(p_config jsonb) returns void language plpgsql security definer set search_path='' as $$
declare sid uuid; begin
  select id into sid from vault.secrets where name='flowstate_marketing_config';
  if sid is null then perform vault.create_secret(p_config::text,'flowstate_marketing_config','Marketing integration configuration; server access only');
  else perform vault.update_secret(sid,p_config::text); end if;
end $$;
revoke all on function public.mkt_set_config(jsonb) from public,anon,authenticated;
grant execute on function public.mkt_set_config(jsonb) to service_role;

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
notify pgrst,'reload schema';
