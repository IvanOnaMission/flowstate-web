// Shared by Netlify and the Supabase scheduled function. No browser credentials.
export const CUSTOMER_LABELS = {
  unknown: 'Unknown', electrical_owner: 'Electrical business owner',
  other_trade_owner: 'Other trade business owner', employee_apprentice: 'Employee / apprentice', other: 'Other',
};
export const customerType = value => Object.hasOwn(CUSTOMER_LABELS, value) ? value
  : Object.keys(CUSTOMER_LABELS).find(k => CUSTOMER_LABELS[k] === value) || 'unknown';
const text = (v, length = 2000) => String(v ?? '').trim().slice(0, length);
const isoNow = () => new Date().toISOString();
const emailKey = v => text(v, 254).toLowerCase();
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const numeric = v => v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v);
export const actionValue = (list, type = 'video_view') => numeric(list?.find(x => x.action_type === type)?.value);
const richText = p => (p?.rich_text || p?.title || []).map(x => x.plain_text || x.text?.content || '').join('');
const selected = p => p?.select?.name || p?.status?.name || '';
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString();
export const calendarDate = (value,timezone='Pacific/Auckland') =>
  new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));

export function database(url, key) {
  async function request(path, method = 'GET', body, headers = {}) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      method, headers: {apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json', ...headers},
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(25000),
    });
    const value = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`Database ${path.split('?')[0]}: ${res.status} ${value?.code || ''}`);
    return value;
  }
  return {
    request,
    async all(table, query = 'select=*') {
      const out = [];
      for (let offset = 0; ; offset += 1000) {
        const rows = await request(`${table}?${query}&limit=1000&offset=${offset}`);
        out.push(...rows); if (rows.length < 1000) return out;
      }
    },
    async upsert(table, rows, conflict = 'id') {
      for (let i = 0; i < rows.length; i += 250) {
        await request(`${table}?on_conflict=${conflict}`, 'POST', rows.slice(i, i + 250), {Prefer: 'resolution=merge-duplicates,return=minimal'});
      }
    },
  };
}

export function resolveAd(tracking = {}, ads = []) {
  const explicit = text(tracking.source_ad_id || tracking.ad_id || tracking.utm_content, 200);
  if (/^\d{8,30}$/.test(explicit)) return {id: explicit, evidence: ads.some(a => a.id === explicit) ? 'captured_ad_id' : 'captured_unverified'};
  const matches = ads.filter(a => a.name === explicit);
  if (explicit && matches.length === 1) return {id: matches[0].id, evidence: 'legacy_name_match'};
  return {id: null, evidence: 'unknown'};
}

export async function saveLead(db, data, ads = []) {
  const email = emailKey(data.email);
  if (!validEmail(email)) return null;
  const rows = await db.request(`mkt_leads?email=eq.${encodeURIComponent(email)}&limit=1`);
  const existing = rows[0] || {};
  const tracking = data.tracking || {};
  const attributed = resolveAd(tracking, ads);
  const row = {
    email, synced_at: isoNow(),
    first_seen_at: [existing.first_seen_at, data.first_seen_at || isoNow()].filter(Boolean).sort()[0],
  };
  for (const k of ['name','phone','company','notion_page_id','crm_stage','lost_reason','notes']) {
    if (data[k] !== undefined && data[k] !== null && data[k] !== '') row[k] = text(data[k]);
  }
  if (data.form_submitted_at) row.form_submitted_at = [existing.form_submitted_at,data.form_submitted_at].filter(Boolean).sort()[0];
  if (!existing.source_ad_id && attributed.id) {
    row.source_ad_id = attributed.id; row.attribution_evidence = attributed.evidence; row.tracking = tracking;
  } else if (!existing.tracking || !Object.keys(existing.tracking).length) row.tracking = tracking;
  if (data.customer_type && customerType(data.customer_type) !== 'unknown') {
    row.customer_type = customerType(data.customer_type); row.classification_source = data.classification_source || 'self_report';
  }
  for (const k of ['qualification','call_outcome','sale_outcome','sale_value']) if (data[k] !== undefined) row[k] = data[k];
  if (existing.id) row.id = existing.id;
  const result = await db.request('mkt_leads?on_conflict=email', 'POST', row, {Prefer: 'resolution=merge-duplicates,return=representation'});
  return result[0];
}

export async function recordFormLead(db, data, at = isoNow()) {
  const ads = await db.all('mkt_ads', 'select=id,name');
  return saveLead(db, {
    email: data.email, name: data.name, phone: data.phone,
    customer_type: customerType(data.customer_type), classification_source: 'self_report',
    first_seen_at: at, form_submitted_at: at,
    tracking: Object.fromEntries(['ad_id','utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing_path'].map(k => [k,text(data[k],200)])),
  }, ads);
}

export async function recordBooking(db, payload) {
  const p = payload.payload || payload;
  const ads = await db.all('mkt_ads', 'select=id,name');
  const lead = await saveLead(db, {email:p.email,name:p.name,phone:p.text_reminder_number,
    first_seen_at:p.created_at,tracking:p.tracking}, ads);
  if (!lead || !p.uri) return;
  const ev = p.scheduled_event || {};
  const canceled = payload.event === 'invitee.canceled' || p.status === 'canceled';
  await db.upsert('mkt_bookings', [{id:p.uri,lead_id:lead.id,event_uri:typeof p.event === 'string' ? p.event : ev.uri,
    status:canceled?'canceled':'active',
    ...(ev.start_time?{start_at:ev.start_time}:{}),...(ev.end_time?{end_at:ev.end_time}:{}),
    canceled_at:p.cancellation?.created_at || null,synced_at:isoNow()}]);
}

function metaClient(config) {
  const base = `https://graph.facebook.com/${config.meta_api_version || 'v26.0'}/`;
  const allowed = 'graph.facebook.com';
  async function get(path, params = {}) {
    const url = new URL(path.startsWith('https://') ? path : base + path);
    if (url.hostname !== allowed) throw new Error('Unexpected Meta pagination host');
    url.searchParams.delete('access_token');
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,typeof v === 'string' ? v : JSON.stringify(v)));
    let res, j;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(url, {headers:{authorization:`Bearer ${config.meta_token}`},signal:AbortSignal.timeout(30000)});
      j = await res.json();
      if (res.ok && !j.error) return j;
      if (![1,2,4,17,32,613].includes(j.error?.code) && !j.error?.is_transient) break;
      await new Promise(resolve => setTimeout(resolve,1000*(attempt+1)));
    }
    throw new Error(`Meta request failed (${res.status}, code ${j.error?.code || 'unknown'})`);
  }
  async function all(path, params) {
    const rows=[]; let j=await get(path,params);
    for (;;) { rows.push(...(j.data || [])); if (!j.paging?.next) return rows; j=await get(j.paging.next); }
  }
  return {get,all};
}

export function dailyMetric(r) {
  return {
    ad_id:r.ad_id,date:r.date_start,spend:numeric(r.spend),impressions:numeric(r.impressions),
    link_clicks:numeric(r.inline_link_clicks) ?? 0,outbound_clicks:actionValue(r.outbound_clicks,'outbound_click') ?? 0,
    landing_page_views:actionValue(r.actions,'landing_page_view') ?? 0,
    video_plays:actionValue(r.video_play_actions),video_3s:actionValue(r.actions),
    thruplays:actionValue(r.video_thruplay_watched_actions),average_watch_seconds:actionValue(r.video_avg_time_watched_actions),
    p25:actionValue(r.video_p25_watched_actions),p50:actionValue(r.video_p50_watched_actions),
    p75:actionValue(r.video_p75_watched_actions),p95:actionValue(r.video_p95_watched_actions),p100:actionValue(r.video_p100_watched_actions),
    meta_leads:actionValue(r.actions,'offsite_conversion.fb_pixel_lead') ?? 0,
    meta_bookings:actionValue(r.conversions,'schedule_website') ?? actionValue(r.actions,'offsite_conversion.fb_pixel_schedule') ?? 0,
    attribution_setting:r.attribution_setting || null,raw_metrics:r,synced_at:isoNow(),
  };
}

async function syncMeta(db,c,backfill) {
  const api=metaClient(c),act=`act_${c.meta_account_id}`;
  const account=await api.get(act,{fields:'id,name,currency,timezone_name'});
  await db.upsert('mkt_accounts',[{id:account.id,name:account.name,currency:account.currency,timezone:account.timezone_name,synced_at:isoNow()}]);
  const statuses=['ACTIVE','PAUSED','ARCHIVED','PENDING_REVIEW','DISAPPROVED','PREAPPROVED','PENDING_BILLING_INFO','CAMPAIGN_PAUSED','ADSET_PAUSED','IN_PROCESS','WITH_ISSUES'];
  const ads=await api.all(`${act}/ads`,{fields:'id,name,effective_status,created_time,campaign{id,name},adset{id,name},creative{id,title,body,video_id,link_url,url_tags,object_story_spec,asset_feed_spec}',effective_status:statuses,limit:100});
  const mapped=ads.map(a=>{
    const cr=a.creative||{},link=cr.object_story_spec?.link_data||{},vid=cr.object_story_spec?.video_data||{};
    const video=cr.video_id||vid.video_id||cr.asset_feed_spec?.videos?.[0]?.video_id;
    return {id:a.id,account_id:account.id,name:a.name,status:a.effective_status,created_at:a.created_time,
      campaign_id:a.campaign?.id,campaign_name:a.campaign?.name,adset_id:a.adset?.id,adset_name:a.adset?.name,
      creative_id:cr.id,headline:cr.title||link.name||vid.title||cr.asset_feed_spec?.titles?.[0]?.text||'',
      body:cr.body||link.message||vid.message||cr.asset_feed_spec?.bodies?.[0]?.text||'',
      destination_url:cr.link_url||link.link||vid.call_to_action?.value?.link||cr.asset_feed_spec?.link_urls?.[0]?.website_url||'',
      url_tags:cr.url_tags||'',video_id:video||null,format:video?'video':'image',synced_at:isoNow()};
  });
  await db.upsert('mkt_ads',mapped);
  // Video metadata is fetched independently; unknown lengths remain unknown.
  const videos=[...new Set(mapped.map(a=>a.video_id).filter(Boolean))];
  for (let i=0;i<videos.length;i+=4) await Promise.all(videos.slice(i,i+4).map(async id=>{
    try { const v=await api.get(id,{fields:'length'}); if (numeric(v.length)!=null) await db.request(`mkt_ads?video_id=eq.${id}`,'PATCH',{video_length:Number(v.length)}); } catch { /* permission varies by asset */ }
  }));
  const fields=['ad_id','ad_name','date_start','date_stop','spend','impressions','inline_link_clicks','outbound_clicks','actions','conversions',
    'video_play_actions','video_thruplay_watched_actions','video_avg_time_watched_actions','video_p25_watched_actions',
    'video_p50_watched_actions','video_p75_watched_actions','video_p95_watched_actions','video_p100_watched_actions'];
  const timezone=account.timezone_name||'Pacific/Auckland';
  const range=backfill?{date_preset:'maximum'}:{time_range:{since:calendarDate(daysAgo(35),timezone),until:calendarDate(isoNow(),timezone)}};
  const rows=await api.all(`${act}/insights`,{level:'ad',time_increment:1,fields:fields.join(','),use_unified_attribution_setting:'true',limit:500,...range});
  const known=new Set(mapped.map(a=>a.id));
  const missing=[...new Map(rows.filter(r=>!known.has(r.ad_id)).map(r=>[r.ad_id,{id:r.ad_id,account_id:account.id,name:r.ad_name||r.ad_id,status:'historical',synced_at:isoNow()}])).values()];
  await db.upsert('mkt_ads',missing); await db.upsert('mkt_ad_daily',rows.map(dailyMetric),'ad_id,date');
  let segments=0; const warnings=[];
  for (const dimension of ['publisher_platform','age','gender','country']) {
    try {
      const segmentsRows=await api.all(`${act}/insights`,{level:'ad',time_increment:1,fields:'ad_id,date_start,spend,impressions,inline_link_clicks',breakdowns:dimension,limit:500,...range});
      await db.upsert('mkt_ad_breakdowns',segmentsRows.map(r=>({ad_id:r.ad_id,date:r.date_start,dimension,segment:r[dimension],spend:numeric(r.spend),impressions:numeric(r.impressions),link_clicks:numeric(r.inline_link_clicks)??0,synced_at:isoNow()})),'ad_id,date,dimension,segment');
      segments+=segmentsRows.length;
    } catch(e) { warnings.push(`${dimension}: ${e.message}`); }
  }
  return {ads:mapped.length,ad_days:rows.length,breakdowns:segments,warnings};
}

async function syncForms(db,c) {
  const headers={authorization:`Bearer ${c.netlify_token}`};
  const res=await fetch(`https://api.netlify.com/api/v1/sites/${c.netlify_site_id}/forms`,{headers,signal:AbortSignal.timeout(20000)});
  if (!res.ok) throw new Error(`Forms list: ${res.status}`);
  const forms=(await res.json()).filter(f=>f.name==='ai-makeover'); let count=0;
  const ads=await db.all('mkt_ads','select=id,name');
  for (const f of forms) for (let page=1;;page++) {
    const res=await fetch(`https://api.netlify.com/api/v1/forms/${f.id}/submissions?per_page=100&page=${page}`,{headers,signal:AbortSignal.timeout(20000)});
    if (!res.ok) throw new Error(`Forms submissions: ${res.status}`);
    const list=await res.json();
    for (const s of list) {
      if (s.spam) continue;
      const d=s.data || {}; await saveLead(db,{email:d.email,name:d.name,phone:d.phone,customer_type:customerType(d.customer_type),
        classification_source:'self_report',first_seen_at:s.created_at,form_submitted_at:s.created_at,
        tracking:Object.fromEntries(['ad_id','utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing_path'].map(k=>[k,text(d[k],200)]))},ads); count++;
    }
    if(list.length<100) break;
  }
  return {form_leads:count};
}

async function syncNotion(db,c) {
  let cursor,count=0; const ads=await db.all('mkt_ads','select=id,name');
  do {
    const res=await fetch(`https://api.notion.com/v1/databases/${c.notion_database_id}/query`,{
      method:'POST',headers:{authorization:`Bearer ${c.notion_token}`,'notion-version':'2022-06-28','content-type':'application/json'},
      body:JSON.stringify({page_size:100,...(cursor?{start_cursor:cursor}:{})}),signal:AbortSignal.timeout(25000),
    });
    if(!res.ok) throw new Error(`CRM read: ${res.status}`);
    const page=await res.json();
    for(const r of page.results || []) {
      const p=r.properties,email=p.Email?.email; if(!validEmail(emailKey(email))) continue;
      const data={email,name:richText(p.Name),phone:p.Phone?.phone_number,company:richText(p.Company),notion_page_id:r.id,
        crm_stage:selected(p.Stage),lost_reason:richText(p['Lost reason']),notes:richText(p['Wiki / notes']),
        first_seen_at:r.created_time,tracking:{source_ad_id:richText(p['Source ad ID'])}};
      const ct=customerType(selected(p['Customer type'])); if(ct!=='unknown') {data.customer_type=ct;data.classification_source='notion';}
      data.qualification={'Qualified':'qualified','Unqualified':'unqualified'}[selected(p.Qualification)]||'unknown';
      data.call_outcome={'Attended':'attended','No-show':'no_show'}[selected(p['Call outcome'])]||'unknown';
      data.sale_outcome={'Won':'won','Lost':'lost'}[selected(p['Sale outcome'])]
        || (['Client — Active','Maintenance'].includes(data.crm_stage)?'won':data.crm_stage==='Lost'?'lost':'unknown');
      data.sale_value=p['Sale value']?.number ?? null;
      await saveLead(db,data,ads);count++;
    }
    cursor=page.has_more?page.next_cursor:null;
  } while(cursor);
  return {crm_leads:count};
}

async function calendlyGet(c,path) {
  const url=new URL(path.startsWith('https://')?path:`https://api.calendly.com${path}`);
  if(url.hostname!=='api.calendly.com')throw new Error('Unexpected booking API host');
  const res=await fetch(url,{headers:{authorization:`Bearer ${c.calendly_token}`},signal:AbortSignal.timeout(25000)});
  if(!res.ok)throw new Error(`Bookings read: ${res.status}`);return res.json();
}
async function syncCalendly(db,c,backfill) {
  const min=backfill?'2026-06-01T00:00:00Z':daysAgo(35),events=[];
  // Include canceled events so cancellations never disappear from history.
  for(const status of ['active','canceled']) {
    let path=`/scheduled_events?user=${encodeURIComponent(c.calendly_user)}&min_start_time=${encodeURIComponent(min)}&count=100&status=${status}`;
    while(path){const v=await calendlyGet(c,path);events.push(...v.collection);path=v.pagination?.next_page||null;}
  }
  let count=0;
  for(let i=0;i<events.length;i+=4) await Promise.all(events.slice(i,i+4).map(async ev=>{
    let path=`${ev.uri}/invitees?count=100`;
    while(path){const v=await calendlyGet(c,path);for(const invitee of v.collection){await recordBooking(db,{...invitee,scheduled_event:ev});count++;}path=v.pagination?.next_page||null;}
  }));
  return {bookings:count};
}

export async function syncTracking(db,c,{sources=['meta','forms','calendly','notion'],backfill=false}={}) {
  const jobs={meta:syncMeta,forms:syncForms,calendly:syncCalendly,notion:syncNotion},results={};
  for(const source of sources) {
    if(!jobs[source])continue;
    if(!await db.request('rpc/mkt_claim_sync','POST',{p_source:source})){results[source]={skipped:'already running'};continue;}
    const run=(await db.request('mkt_sync_runs','POST',{source,status:'running'},{Prefer:'return=representation'}))[0];
    try {
      const counts=await jobs[source](db,c,backfill);const status=counts.warnings?.length?'partial':'success';
      await db.request(`mkt_sync_runs?id=eq.${run.id}`,'PATCH',{status,counts,finished_at:isoNow(),error:counts.warnings?.join('; ')||null});
      await db.request(`mkt_sync_state?source=eq.${source}`,'PATCH',{lease_until:null,last_success_at:isoNow()});results[source]={status,...counts};
    } catch(e) {
      const message=text(e.message,500);
      await db.request(`mkt_sync_runs?id=eq.${run.id}`,'PATCH',{status:'failed',error:message,finished_at:isoNow()});
      await db.request(`mkt_sync_state?source=eq.${source}`,'PATCH',{lease_until:null});results[source]={status:'failed',error:message};
    }
  }
  return results;
}

export async function trackingReport(db,{since,until}) {
  const [ads,daily,segments,leads,bookings,runs]=await Promise.all([
    db.all('mkt_ads','select=*'),
    db.all('mkt_ad_daily',`select=ad_id,date,spend,impressions,link_clicks,outbound_clicks,landing_page_views,video_plays,video_3s,thruplays,average_watch_seconds,p25,p50,p75,p95,p100,meta_leads,meta_bookings&date=gte.${since}&date=lte.${until}`),
    db.all('mkt_ad_breakdowns',`select=*&date=gte.${since}&date=lte.${until}`),
    db.all('mkt_leads','select=*'),db.all('mkt_bookings','select=*'),
    Promise.all(['meta','forms','calendly','notion'].map(source =>
      db.request(`mkt_sync_runs?select=*&source=eq.${source}&order=started_at.desc&limit=1`)
    )).then(rows => rows.flat()),
  ]);
  return {ads,daily,segments,leads,bookings,runs,since,until,timezone:'Pacific/Auckland',currency:'NZD'};
}
