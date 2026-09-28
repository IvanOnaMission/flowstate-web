import {database,syncTracking} from '../../../netlify/lib/ads-tracking.mjs';
Deno.serve(async(req:Request)=>{
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
  // Platform JWT verification plus a server credential check: ordinary users cannot run syncs.
  if(!key||req.headers.get('authorization')!==`Bearer ${key}`)return new Response('Unauthorized',{status:401});
  if(req.method!=='POST')return new Response('POST only',{status:405});
  try{
    const db=database(Deno.env.get('SUPABASE_URL')!,key);
    const config=await db.request('rpc/mkt_config','POST',{});
    const body=await req.json().catch(()=>({}));
    const result=await syncTracking(db,config,{sources:body.sources,backfill:body.backfill===true});
    return Response.json(result,{status:Object.values(result).some((r:any)=>r.status==='failed')?207:200});
  }catch(e){console.error('Tracking sync failed:',e.message);return Response.json({error:'Tracking sync failed'},{status:500});}
});
