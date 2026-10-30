import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveAd,dailyMetric,saveLead,customerType,recordBooking,calendarDate,syncTracking} from './ads-tracking.mjs';
test('the Meta date range includes today in the ad account timezone',()=>{
  const now='2026-09-28T21:00:00Z';
  assert.equal(calendarDate(now,'Pacific/Auckland'),'2026-09-29');
  assert.equal(calendarDate(now,'UTC'),'2026-09-28');
});
test('attribution identifies only known IDs or an unambiguous legacy ad name',()=>{
  const ads=[{id:'123456789',name:'Quote faster'},{id:'987654321',name:'Quote faster'}];
  assert.deepEqual(resolveAd({ad_id:'123456789'},ads),{id:'123456789',evidence:'captured_ad_id'});
  assert.equal(resolveAd({utm_content:'Quote faster'},ads).id,null);
  assert.equal(resolveAd({utm_content:'{{ad.id}}'},ads).id,null);
  assert.equal(resolveAd({ad_id:'1234567890'},ads).evidence,'captured_unverified');
});
test('a sparse cancellation preserves the previously captured meeting time',async()=>{
  let stored={start_at:'2026-09-29T00:00:00Z',end_at:'2026-09-29T00:30:00Z'};
  const db={all:async()=>[],request:async(path,method,body)=>method==='POST'?[{...body,id:'lead'}]:[],
    upsert:async(table,rows)=>{stored={...stored,...rows[0]};}};
  await recordBooking(db,{event:'invitee.canceled',payload:{uri:'https://api.calendly.com/scheduled_events/a/invitees/b',email:'jane@example.nz',event:'https://api.calendly.com/scheduled_events/a',status:'canceled'}});
  assert.equal(stored.status,'canceled');assert.equal(stored.start_at,'2026-09-29T00:00:00Z');assert.equal(stored.end_at,'2026-09-29T00:30:00Z');
});
test('unavailable video metrics stay unknown and lead results use the correct action',()=>{
  const r=dailyMetric({ad_id:'123',date_start:'2026-09-29',spend:'10',impressions:'100',inline_link_clicks:'2',actions:[{action_type:'offsite_conversion.fb_pixel_lead',value:'3'},{action_type:'video_view',value:'18'}]});
  assert.equal(r.meta_leads,3);assert.equal(r.video_3s,18);assert.equal(r.p50,null);assert.equal(r.average_watch_seconds,null);
});
test('a returning lead keeps their first source and known customer type',async()=>{
  let posted;
  const db={request:async(path,method,body)=>{
    if(method==='POST'){posted=body;return [body];}
    return [{id:'existing',email:'jane@example.nz',source_ad_id:'123456789',customer_type:'electrical_owner',first_seen_at:'2026-09-01T00:00:00Z',tracking:{ad_id:'123456789'}}];
  }};
  await saveLead(db,{email:' JANE@example.nz ',customer_type:'unknown',first_seen_at:'2026-09-29T00:00:00Z',tracking:{ad_id:'987654321'}},[]);
  assert.equal(posted.email,'jane@example.nz');assert.equal(posted.first_seen_at,'2026-09-01T00:00:00Z');
  assert.equal(Object.hasOwn(posted,'source_ad_id'),false);assert.equal(Object.hasOwn(posted,'customer_type'),false);
  assert.equal(customerType('electrician'),'unknown');
});
test('a changed CRM email updates the same lead and keeps linked bookings intact',async()=>{
  let updated;
  const db={request:async(path,method,body)=>{
    if(path.startsWith('mkt_leads?email='))return [];
    if(path.startsWith('mkt_leads?notion_page_id='))return [{id:'lead-1',email:'old@example.nz',notion_page_id:'page-1',first_seen_at:'2026-09-01T00:00:00Z',source_ad_id:'123456789',tracking:{ad_id:'123456789'}}];
    if(method==='PATCH'){updated={path,body};return [{id:'lead-1',...body}];}
    throw new Error('Unexpected database operation');
  }};
  const result=await saveLead(db,{email:'new@example.nz',notion_page_id:'page-1',first_seen_at:'2026-10-03T00:00:00Z'},[]);
  assert.equal(updated.path,'mkt_leads?id=eq.lead-1');
  assert.equal(updated.body.email,'new@example.nz');
  assert.equal(updated.body.first_seen_at,'2026-09-01T00:00:00Z');
  assert.equal(Object.hasOwn(updated.body,'source_ad_id'),false);
  assert.equal(result.id,'lead-1');
});
test('CRM outcomes import from Twenty, keep migrated identities and skip test records',async()=>{
  const oldFetch=globalThis.fetch,saved=[],urls=[];
  globalThis.fetch=async url=>{urls.push(url);return Response.json(url.includes('starting_after')
    ?{data:{opportunities:[{emailLookup:'test@example.nz',sourceRecordKind:'TEST',stage:'NEW'}]},pageInfo:{hasNextPage:false}}
    :{data:{opportunities:[{name:'Jane',emailLookup:'jane@example.nz',sourceRecordKind:'CONTACT',stage:'CUSTOMER',notionSourceId:'page-1',
      customerType:'ELECTRICAL_BUSINESS_OWNER',qualification:'QUALIFIED',callOutcome:'ATTENDED',saleOutcome:null,saleValue:5000,sourceAdId:'123456789',createdAt:'2026-09-01T00:00:00Z'}]},
      pageInfo:{hasNextPage:true,endCursor:'cursor-1'}});};
  const db={all:async()=>[],request:async(path,method,body)=>{
    if(path==='rpc/mkt_claim_sync')return true;
    if(path==='mkt_sync_runs'&&method==='POST')return [{id:'run-1'}];
    if(path.startsWith('mkt_leads?email=')||path.startsWith('mkt_leads?notion_page_id='))return [];
    if(path.startsWith('mkt_leads?on_conflict')){saved.push(body);return [body];}
    return [];
  }};
  try {
    const result=await syncTracking(db,{twenty_api_url:'https://crm.example/',twenty_api_key:'test'},{sources:['twenty']});
    assert.equal(result.twenty.status,'success');assert.equal(result.twenty.crm_leads,1);
    assert.ok(urls[0].startsWith('https://crm.example/rest/opportunities?'));assert.match(urls[1],/starting_after=cursor-1/);
    const lead=saved[0];
    assert.equal(lead.notion_page_id,'page-1');assert.equal(lead.customer_type,'electrical_owner');assert.equal(lead.qualification,'qualified');
    assert.equal(lead.call_outcome,'attended');assert.equal(lead.sale_outcome,'won');assert.equal(lead.sale_value,5000);
  } finally { globalThis.fetch=oldFetch; }
});
