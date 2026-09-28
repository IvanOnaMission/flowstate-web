import {database} from './ads-tracking.mjs';
export function trackingDatabase() {
  if(!process.env.MKT_SUPABASE_URL || !process.env.MKT_SUPABASE_SERVICE_KEY) return null;
  return database(process.env.MKT_SUPABASE_URL,process.env.MKT_SUPABASE_SERVICE_KEY);
}
export async function trackingUser(req) {
  const token=req.headers.get('authorization') || '';
  if(!/^Bearer \S+$/.test(token))return null;
  const db=trackingDatabase(); if(!db)return null;
  const res=await fetch(`${process.env.MKT_SUPABASE_URL}/auth/v1/user`,{headers:{apikey:process.env.MKT_SUPABASE_ANON_KEY,authorization:token},signal:AbortSignal.timeout(10000)});
  if(!res.ok)return null;
  const user=await res.json(); if(!user.id)return null;
  const rows=await db.request(`mkt_members?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`);
  return rows.length?user:null;
}
export const trackingJson=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
