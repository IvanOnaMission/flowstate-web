import {database,syncTracking} from '../netlify/lib/ads-tracking.mjs';
const url=process.env.MKT_SUPABASE_URL,key=process.env.MKT_SUPABASE_SERVICE_KEY;
if(!url||!key)throw new Error('Set MKT_SUPABASE_URL and MKT_SUPABASE_SERVICE_KEY in the server environment.');
const db=database(url,key),config=await db.request('rpc/mkt_config','POST',{});
const source=process.argv.find(a=>a.startsWith('--source='))?.split('=')[1];
const result=await syncTracking(db,config,{sources:source?[source]:undefined,backfill:process.argv.includes('--backfill')});
console.log(JSON.stringify(result,null,2));
if(Object.values(result).some(r=>r.status==='failed'))process.exitCode=1;
