import {trackingDatabase,trackingJson} from '../lib/tracking-server.mjs';
export default async req=>{
  if(req.method==='GET')return trackingJson(200,{url:process.env.MKT_SUPABASE_URL,key:process.env.MKT_SUPABASE_ANON_KEY});
  if(req.method!=='POST')return trackingJson(405,{error:'POST only'});
  const origin=req.headers.get('origin');
  if(origin&&!['https://flowstate.net.nz','https://www.flowstate.net.nz'].includes(origin))return trackingJson(403,{error:'Invalid origin.'});
  try{
    const body=await req.json();
    if(body.action!=='password')return trackingJson(400,{error:'Unknown sign-in method.'});
    const res=await fetch(`${process.env.MKT_SUPABASE_URL}/auth/v1/token?grant_type=password`,{
      method:'POST',headers:{apikey:process.env.MKT_SUPABASE_ANON_KEY,'content-type':'application/json'},
      body:JSON.stringify({email:String(body.email||'').trim(),password:String(body.password||'')}),signal:AbortSignal.timeout(15000),
    });
    const session=await res.json();
    if(!res.ok||!session.user?.id)return trackingJson(401,{error:'Check your email and password.'});
    const members=await trackingDatabase().request(`mkt_members?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`);
    if(!members.length)return trackingJson(403,{error:'This account does not have access to marketing data.'});
    return trackingJson(200,{access_token:session.access_token,refresh_token:session.refresh_token,expires_at:Math.floor(Date.now()/1000)+session.expires_in});
  }catch{return trackingJson(502,{error:'Sign-in is unavailable. Try again.'});}
};
