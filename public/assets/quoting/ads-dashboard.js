(() => {
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nzDate=v=>new Intl.DateTimeFormat('en-CA',{timeZone:'Pacific/Auckland',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(v));
  const money=v=>v==null?'—':new Intl.NumberFormat('en-NZ',{style:'currency',currency:'NZD',maximumFractionDigits:2}).format(v);
  const number=v=>v==null?'—':new Intl.NumberFormat('en-NZ').format(v);
  const ratio=(a,b)=>a==null||!b?null:a/b;
  const pct=v=>v==null?'—':`${(v*100).toFixed(2)}%`;
  const total=(rows,key)=>{const values=rows.map(r=>r[key]).filter(v=>v!=null);return values.length?values.reduce((a,b)=>a+Number(b),0):null;};
  const labels={unknown:'Unknown',electrical_owner:'Electrical owner',other_trade_owner:'Other trade owner',employee_apprentice:'Employee / apprentice',other:'Other'};
  let session=null,report=null,chosen=null,auth=null;
  try{session=JSON.parse(sessionStorage.getItem('flowstate-ads-session'));}catch{}
  const saveSession=s=>{session=s;try{if(s)sessionStorage.setItem('flowstate-ads-session',JSON.stringify(s));else sessionStorage.removeItem('flowstate-ads-session');}catch{}};
  async function token(){
    if(!session)return null;
    if(session.expires_at>Date.now()/1000+30)return session.access_token;
    auth ||= await fetch('/.netlify/functions/ads-auth').then(r=>r.json());
    const res=await fetch(`${auth.url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:auth.key,'content-type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});
    if(!res.ok){signOut();throw new Error('Please sign in again.');}
    const s=await res.json();saveSession({access_token:s.access_token,refresh_token:s.refresh_token,expires_at:Date.now()/1000+s.expires_in});return s.access_token;
  }
  async function api(name,options={}){
    const t=await token();if(!t)throw new Error('Please sign in.');
    const res=await fetch(`/.netlify/functions/${name}`,{...options,headers:{authorization:`Bearer ${t}`,'content-type':'application/json',...options.headers}});
    const body=await res.json();if(!res.ok){if(res.status===401)signOut();throw new Error(body.error||'Request failed.');}return body;
  }
  function signOut(){saveSession(null);$('#workspace').hidden=true;$('#logout').hidden=true;$('#login').hidden=false;report=null;}
  $('#logout').onclick=async()=>{const t=session?.access_token;signOut();try{auth ||= await fetch('/.netlify/functions/ads-auth').then(r=>r.json());await fetch(`${auth.url}/auth/v1/logout?scope=local`,{method:'POST',headers:{apikey:auth.key,authorization:`Bearer ${t}`}});}catch{}};
  $('#login-form').onsubmit=async e=>{
    e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;$('#login-status').textContent='Signing in…';
    try{const res=await fetch('/.netlify/functions/ads-auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'password',email:$('#email').value,password:$('#password').value})});
      const s=await res.json();if(!res.ok)throw new Error(s.error);saveSession(s);$('#password').value='';$('#login-status').textContent='';await load();
    }catch(err){$('#login-status').textContent=err.message;}finally{button.disabled=false;}
  };
  function dates(days){$('#until').value=nzDate(Date.now());$('#since').value=days==='all'?'2026-01-01':nzDate(Date.now()-(Number(days)-1)*86400000);}
  dates(30);
  $$('[data-days]').forEach(b=>b.onclick=()=>{dates(b.dataset.days);load();});
  $('#sync-meta').onclick=async()=>{
    const button=$('#sync-meta');button.disabled=true;button.textContent='Syncing Meta…';$('#error').hidden=true;
    try{const result=await api('ads-sync',{method:'POST',body:'{}'});await load();if(result.status==='running'){$('#sync-status').textContent='Meta import is already running. Reload data shortly.';}}
    catch(err){$('#error').textContent=err.message;$('#error').hidden=false;}
    finally{button.disabled=false;button.textContent='Sync Meta now';}
  };
  $('#refresh').onclick=load;$('#since').onchange=load;$('#until').onchange=load;
  $('#search').oninput=renderAds;$('#lead-filter').onchange=renderLeads;
  $$('[data-view]').forEach(b=>b.onclick=()=>{for(const x of $$('[data-view]'))x.removeAttribute('aria-current');b.setAttribute('aria-current','page');for(const name of ['ads','leads','audience'])$(`#${name}-view`).hidden=name!==b.dataset.view;});
  async function load(){
    if(!session)return;
    $('#login').hidden=true;$('#workspace').hidden=false;$('#logout').hidden=false;$('#refresh').disabled=true;$('#sync-status').textContent='Loading…';$('#error').hidden=true;
    try{report=await api(`ads-data?since=${$('#since').value}&until=${$('#until').value}`);render();}
    catch(err){$('#error').textContent=err.message;$('#error').hidden=false;$('#sync-status').textContent='Could not refresh';}
    finally{$('#refresh').disabled=false;}
  }
  function cohort(){return report.leads.filter(l=>{const d=nzDate(l.first_seen_at);return d>=report.since&&d<=report.until;});}
  function bookingsFor(l){return report.bookings.filter(b=>b.lead_id===l.id&&b.status==='active');}
  function summary(ad){
    const rows=report.daily.filter(r=>r.ad_id===ad.id),leads=cohort().filter(l=>l.source_ad_id===ad.id),s={};
    for(const k of ['spend','impressions','link_clicks','outbound_clicks','landing_page_views','video_plays','video_3s','thruplays','p25','p50','p75','p95','p100','meta_leads','meta_bookings'])s[k]=total(rows,k);
    const watches=rows.filter(r=>r.average_watch_seconds!=null&&r.video_plays>0),weight=total(watches,'video_plays');
    s.average_watch_seconds=weight?watches.reduce((a,r)=>a+r.average_watch_seconds*r.video_plays,0)/weight:null;
    s.ctr=ratio(s.link_clicks,s.impressions);s.hook=ratio(s.video_3s,s.impressions);s.leads=leads.filter(l=>l.form_submitted_at).length;
    s.owners=leads.filter(l=>l.customer_type==='electrical_owner').length;s.booked=leads.filter(l=>bookingsFor(l).length).length;
    s.qualified=leads.filter(l=>l.qualification==='qualified').length;
    s.attended=leads.filter(l=>l.call_outcome==='attended').length;s.won=leads.filter(l=>l.sale_outcome==='won').length;return s;
  }
  function render(){
    const leads=cohort(),spend=total(report.daily,'spend')||0;
    const cards=[['Ad spend',money(spend)],['Link CTR',pct(ratio(total(report.daily,'link_clicks'),total(report.daily,'impressions')))],['Meta leads',number(total(report.daily,'meta_leads'))],['Meta cost / lead',money(total(report.daily,'meta_leads')?spend/total(report.daily,'meta_leads'):null)],['Form contacts',number(leads.filter(l=>l.form_submitted_at).length)],['Electrical owners',number(leads.filter(l=>l.customer_type==='electrical_owner').length)],['Booked contacts',number(leads.filter(l=>bookingsFor(l).length).length)],['Qualified leads',number(leads.filter(l=>l.qualification==='qualified').length)],['Confirmed clients',number(leads.filter(l=>l.sale_outcome==='won').length)],['Recorded sales',money(total(leads.filter(l=>l.sale_outcome==='won'),'sale_value'))]];
    $('#stats').innerHTML=cards.map(([label,value])=>`<div class="stat"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('');
    const latest=new Map();for(const r of report.runs)if(!latest.has(r.source))latest.set(r.source,r);
    const issues=[...latest.values()].filter(r=>r.status==='failed'||r.status==='partial');
    const meta=latest.get('meta');$('#sync-status').textContent=meta?.finished_at?`Meta synced ${new Date(meta.finished_at).toLocaleString('en-NZ',{timeZone:'Pacific/Auckland'})} · Auto-sync every 2 hours`:'First Meta sync pending';
    if(issues.length){$('#error').textContent=`Import needs attention: ${issues.map(r=>r.source).join(', ')}. Last saved data is still shown.`;$('#error').hidden=false;}
    renderAds();renderLeads();renderAudience();
  }
  function renderAds(){
    if(!report)return;const search=$('#search').value.toLowerCase();
    const ads=report.ads.filter(a=>[a.name,a.topic,a.campaign_name].join(' ').toLowerCase().includes(search)).map(a=>({a,s:summary(a)})).sort((x,y)=>(y.s.spend||0)-(x.s.spend||0));
    $('#ad-rows').innerHTML=ads.map(({a,s})=>`<tr><td><button class="ad-name" data-ad="${esc(a.id)}">${esc(a.name)}</button><small>${esc(a.campaign_name||'Historical ad')} · ${esc(a.status||'Unknown status')}${a.topic?`<br>${esc(a.topic)}`:''}</small></td><td>${money(s.spend)}</td><td>${pct(s.ctr)}</td><td>${pct(s.hook)}</td><td>${s.average_watch_seconds==null?'—':s.average_watch_seconds.toFixed(1)+'s'}</td><td>${number(s.meta_leads)}</td><td>${s.meta_leads?money((s.spend||0)/s.meta_leads):'—'}</td><td>${s.leads}</td><td>${s.owners}</td><td>${s.booked}</td><td>${s.attended}</td><td>${s.won}</td></tr>`).join('')||'<tr><td colspan="12" class="empty">No matching ads.</td></tr>';
    $$('[data-ad]').forEach(b=>b.onclick=()=>detail(b.dataset.ad));
  }
  function renderLeads(){
    if(!report)return;const filter=$('#lead-filter').value;
    const leads=cohort().filter(l=>filter==='all'||filter==='unbooked'&&!bookingsFor(l).length||filter==='owners'&&l.customer_type==='electrical_owner'||filter==='unknown'&&l.customer_type==='unknown').sort((a,b)=>b.first_seen_at.localeCompare(a.first_seen_at));
    $('#lead-rows').innerHTML=leads.map(l=>{const ad=report.ads.find(a=>a.id===l.source_ad_id),bookings=bookingsFor(l),last=bookings.sort((a,b)=>(b.start_at||'').localeCompare(a.start_at||''))[0];
      const source=ad?ad.name:l.source_ad_id?'Unverified ad ID':'Unknown';
      return `<tr><td>${esc(l.name||l.email)}<small>${esc(l.email)}${l.company?'<br>'+esc(l.company):''}</small></td><td>${esc(labels[l.customer_type]||'Unknown')}<small>${esc(l.qualification||'unknown')}</small></td><td>${esc(source)}<small>${esc(l.attribution_evidence.replaceAll('_',' '))}</small></td><td>${last?'Booked':'No active booking'}<small>${last?.start_at?esc(new Date(last.start_at).toLocaleString('en-NZ',{timeZone:'Pacific/Auckland'})):''}</small></td><td>${esc(l.call_outcome.replaceAll('_',' '))}</td><td>${esc(l.sale_outcome)}${l.sale_value!=null?'<small>'+money(l.sale_value)+'</small>':''}</td><td>${l.notion_page_id?`<a href="https://www.notion.so/${encodeURIComponent(l.notion_page_id.replaceAll('-',''))}" target="_blank" rel="noopener">Open CRM</a>`:'—'}<small>${esc(l.crm_stage||'')}</small></td></tr>`;
    }).join('')||'<tr><td colspan="7" class="empty">No leads match this date range and filter.</td></tr>';
  }
  function renderAudience(){
    $('#segments').innerHTML=['publisher_platform','age','gender','country'].map(dim=>{
      const groups=new Map();for(const r of report.segments.filter(r=>r.dimension===dim)){const v=groups.get(r.segment)||{spend:0,impressions:0,clicks:0};v.spend+=r.spend||0;v.impressions+=r.impressions||0;v.clicks+=r.link_clicks||0;groups.set(r.segment,v);}
      const title={publisher_platform:'Platform',age:'Age range',gender:'Gender',country:'Country'}[dim];
      return `<section><h3>${title}</h3><div class="table-wrap"><table><thead><tr><th>Group</th><th>Spend</th><th>Link clicks</th><th>Link CTR</th></tr></thead><tbody>${[...groups].sort((a,b)=>b[1].spend-a[1].spend).map(([key,v])=>`<tr><td>${esc(key)}</td><td>${money(v.spend)}</td><td>${number(v.clicks)}</td><td>${pct(ratio(v.clicks,v.impressions))}</td></tr>`).join('')||'<tr><td colspan="4">No breakdown available.</td></tr>'}</tbody></table></div></section>`;
    }).join('');
  }
  function detail(id){
    chosen=report.ads.find(a=>a.id===id);if(!chosen)return;const s=summary(chosen);$('#detail-title').textContent=chosen.name;
    const marks=['p25','p50','p75','p95','p100'];
    $('#detail-content').innerHTML=`<p>${esc(chosen.campaign_name||'')} · ${esc(chosen.adset_name||'')}</p><div class="ad-copy">${esc(chosen.headline||'')}${chosen.headline?'\n\n':''}${esc(chosen.body||'Creative copy unavailable.')}</div><div class="detail-stats">${[['Link clicks',number(s.link_clicks)],['Page visits',number(s.landing_page_views)],['Meta-reported leads',number(s.meta_leads)],['Meta-reported bookings',number(s.meta_bookings)]].map(([label,value])=>`<div>${label}<strong>${value}</strong></div>`).join('')}</div><h3>Video viewing milestones</h3><p>Video plays: ${number(s.video_plays)} · 3-second views: ${number(s.video_3s)} · Average watch: ${s.average_watch_seconds==null?'—':s.average_watch_seconds.toFixed(1)+'s'}</p>${marks.map(k=>{const percent=Number(k.slice(1)),r=ratio(s[k],s.video_plays),time=chosen.video_length?` · ${(chosen.video_length*percent/100).toFixed(0)}s`:'';return `<div class="milestone"><span>${percent}%${time}</span><div class="bar"><span style="width:${r==null?0:Math.max(0,Math.min(100,r*100))}%"></span></div><span>${number(s[k])}</span></div>`;}).join('')}<p class="method">Counts at each milestone, not individual viewing paths. Seeking and repeat viewing can affect counts. Comparing link clicks with video plays does not prove those same viewers clicked. Daily average watch times are combined using video-play counts.</p><p>Link clicks / video plays: ${pct(ratio(s.link_clicks,s.video_plays))} · Cost per confirmed client: ${s.won?money((s.spend||0)/s.won):'No confirmed clients in this cohort'}</p>`;
    $('#detail-content').insertAdjacentHTML('beforeend',`<p>Cost per form lead: ${s.leads?money((s.spend||0)/s.leads):'—'} · Cost per electrical owner: ${s.owners?money((s.spend||0)/s.owners):'—'} · Cost per qualified lead: ${s.qualified?money((s.spend||0)/s.qualified):'—'}</p>`);
    for(const k of ['topic','objection','hook','notes'])$('#notes-form').elements.namedItem(k).value=chosen[k]||'';
    $('#notes-status').textContent='';$('#detail').showModal();
  }
  $('#close-detail').onclick=()=>$('#detail').close();
  $('#notes-form').onsubmit=async e=>{e.preventDefault();$('#notes-status').textContent='Saving…';try{const values=Object.fromEntries(new FormData(e.target));await api('ads-notes',{method:'PATCH',body:JSON.stringify({id:chosen.id,...values})});Object.assign(chosen,values);$('#notes-status').textContent='Saved';renderAds();}catch(err){$('#notes-status').textContent=err.message;}};
  if(session)load();
})();
