import {trackingReport,calendarDate} from '../lib/ads-tracking.mjs';
import {trackingDatabase,trackingUser,trackingJson} from '../lib/tracking-server.mjs';
export default async req=>{
  if(req.method!=='GET')return trackingJson(405,{error:'GET only'});
  try{
    if(!await trackingUser(req))return trackingJson(401,{error:'Sign in to view your ads.'});
    const url=new URL(req.url),today=calendarDate(Date.now());
    const until=url.searchParams.get('until')||today;
    const since=url.searchParams.get('since')||calendarDate(Date.now()-29*86400000);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(since)||!/^\d{4}-\d{2}-\d{2}$/.test(until)||since>until)return trackingJson(400,{error:'Choose a valid date range.'});
    return trackingJson(200,await trackingReport(trackingDatabase(),{since,until}));
  }catch(e){console.error('ads-data:',e.message);return trackingJson(502,{error:'Could not load tracking data. Try again.'});}
};
