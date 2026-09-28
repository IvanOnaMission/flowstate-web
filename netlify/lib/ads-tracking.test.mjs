import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveAd,dailyMetric,saveLead,customerType,recordBooking,calendarDate} from './ads-tracking.mjs';
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
