import {trackingDatabase,trackingUser,trackingJson} from '../lib/tracking-server.mjs';
export default async req=>{
  if(req.method!=='PATCH')return trackingJson(405,{error:'PATCH only'});
  try{
    if(!await trackingUser(req))return trackingJson(401,{error:'Sign in first.'});
    const body=await req.json();
    if(!/^\d{8,30}$/.test(body.id||''))return trackingJson(400,{error:'Invalid ad.'});
    const values={};for(const k of ['topic','objection','hook','notes'])if(typeof body[k]==='string')values[k]=body[k].trim().slice(0,4000);
    await trackingDatabase().request(`mkt_ads?id=eq.${body.id}`,'PATCH',values);
    return trackingJson(200,{saved:true});
  }catch{return trackingJson(502,{error:'Notes could not be saved.'});}
};
