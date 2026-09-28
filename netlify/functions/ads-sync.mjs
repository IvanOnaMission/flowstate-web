import {trackingUser,trackingJson} from '../lib/tracking-server.mjs';
export default async req=>{
  if(req.method!=='POST')return trackingJson(405,{error:'POST only'});
  try{
    if(!await trackingUser(req))return trackingJson(401,{error:'Sign in to sync Meta.'});
    const res=await fetch(`${process.env.MKT_SUPABASE_URL}/functions/v1/meta-sync`,{
      method:'POST',headers:{authorization:`Bearer ${process.env.MKT_SUPABASE_SERVICE_KEY}`,'content-type':'application/json'},
      body:JSON.stringify({sources:['meta']}),signal:AbortSignal.timeout(80000),
    });
    const result=await res.json();
    if(!res.ok||result.meta?.status==='failed')return trackingJson(502,{error:'Meta sync failed. Last saved data is still available.'});
    return trackingJson(200,{status:result.meta?.skipped?'running':result.meta?.status||'success'});
  }catch{return trackingJson(502,{error:'Could not finish the Meta sync. Last saved data is still available.'});}
};
