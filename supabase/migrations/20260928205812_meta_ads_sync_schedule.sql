-- Owner access uses the existing FlowState account; Freeflow is a separate project.
insert into public.mkt_members(user_id)
select id from auth.users where email = 'irbarnett@icloud.com'
on conflict do nothing;

-- Jobs read the server credential from Vault at execution time.
select cron.schedule('flowstate-meta-ads-sync', '11 */2 * * *', $job$
  select net.http_post(
    url := 'https://ypsejvbfbfnpszxtwwoa.supabase.co/functions/v1/meta-sync',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
      'Bearer ' || (select decrypted_secret::jsonb->>'cron_auth' from vault.decrypted_secrets where name = 'flowstate_marketing_config')),
    body := '{"sources":["meta"]}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
select cron.schedule('flowstate-marketing-leads-sync', '*/15 * * * *', $job$
  select net.http_post(
    url := 'https://ypsejvbfbfnpszxtwwoa.supabase.co/functions/v1/meta-sync',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
      'Bearer ' || (select decrypted_secret::jsonb->>'cron_auth' from vault.decrypted_secrets where name = 'flowstate_marketing_config')),
    body := '{"sources":["forms","calendly","notion"]}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
