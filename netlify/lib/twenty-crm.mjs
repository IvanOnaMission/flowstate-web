import {createHash} from 'node:crypto';
import {CUSTOMER_LABELS,customerType as normaliseCustomerType} from './ads-tracking.mjs';

const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Pacific/Auckland'});
const uuid=value=>{const b=createHash('sha256').update('flowstate-notion-migration:'+value).digest().subarray(0,16);b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128;const h=b.toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;};
const emailKey=email=>String(email||'').trim().toLowerCase();
const selectValue=s=>s.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'');
const body=markdown=>({markdown});

async function request(path,method='GET',data){
 if(!process.env.TWENTY_API_URL||!process.env.TWENTY_API_KEY)throw new Error('Twenty CRM is not configured');
 const res=await fetch(process.env.TWENTY_API_URL.replace(/\/$/,'')+'/rest'+path,{method,signal:AbortSignal.timeout(15000),headers:{authorization:`Bearer ${process.env.TWENTY_API_KEY}`,'content-type':'application/json'},body:data?JSON.stringify(data):undefined});
 const out=await res.json().catch(()=>({}));
 if(!res.ok||out.status>=400||out.errors){const error=new Error(`Twenty CRM ${method} ${path.split('?')[0]} failed (${res.status})`);error.status=res.status;throw error;}
 return out.data;
}
const filter=(field,value)=>encodeURIComponent(`${field}[eq]:${JSON.stringify(value)}`);
const findOne=async path=>{try{return await request(path);}catch(error){if(error.status===404)return null;throw error;}};
async function findOpportunity(email){
 const rows=(await request('/opportunities?filter='+filter('emailLookup',emailKey(email))+'&limit=60')).opportunities;
 return rows.find(r=>r.sourceRecordKind!=='DUPLICATE'&&r.sourceRecordKind!=='TEST')||null;
}
async function createOrGet(plural,id,data){
 try{await request('/'+plural,'POST',{id,...data});}
 catch(error){
  // A concurrent submission can have created the same deterministic ID.
  if(![400,409].includes(error.status))throw error;
  const existing=await findOne('/'+plural+'/'+id);
  if(!existing)throw error;
 }
 return id;
}
async function ensureOpportunity({email,name,phone,source}){
 const existing=await findOpportunity(email);if(existing)return existing;
 const personId=uuid('website-person:'+emailKey(email));
 const person=(await request('/people?filter='+filter('emails.primaryEmail',emailKey(email))+'&limit=1')).people[0];
 if(!person)await createOrGet('people',personId,{name:{firstName:String(name||email).trim(),lastName:''},emails:{primaryEmail:emailKey(email),additionalEmails:[]}});
 const id=uuid('website-opportunity:'+emailKey(email));
 await createOrGet('opportunities',id,{name:name||email,stage:'NEW',pointOfContactId:person?.id||personId,emailLookup:emailKey(email),sourceEmail:email,sourcePhone:phone||'',sourceRecordKind:'CONTACT',relationshipType:'WARM',planValue:'Workflow diagnostic → AI partnership (scope and rate agreed after diagnostic)',wikiNotes:source?.startsWith('Facebook Instant Form')?`Enquired through ${source}.`:`Came in through the workflow diagnostic page${source?` (${source})`:''}.`});
 return (await findOpportunity(email))||{id,name:name||email,pointOfContactId:person?.id||personId};
}
async function followUp(op,title,due){
 const id=uuid(op.notionSourceId?'task:'+op.notionSourceId:'website-task:'+op.id);
 const data={title:`${op.name} — ${title}`,bodyV2:body(title+'\n\nFollow-up date: '+due),status:'TODO',dueAt:due.includes('T')?due:due+'T00:00:00Z'};
 const existing=await findOne('/tasks/'+id);
 if(existing)await request('/tasks/'+id,'PATCH',data);else await createOrGet('tasks',id,data);
 await createOrGet('taskTargets',uuid(id+'targetOpportunityId'+op.id),{taskId:id,targetOpportunityId:op.id});
 if(op.pointOfContactId)await createOrGet('taskTargets',uuid(id+'targetPersonId'+op.pointOfContactId),{taskId:id,targetPersonId:op.pointOfContactId});
}
export async function twentyLead(input){
 if(!input.email)return;
 const op=await ensureOpportunity(input),kind=normaliseCustomerType(input.customerType),date=today();
 const update={nextAction:'Call within 5 minutes',nextActionDate:date+'T00:00:00Z',lastTouch:date};
 if(kind!=='unknown')update.customerType=selectValue(CUSTOMER_LABELS[kind]);
 if(/^\d{8,30}$/.test(input.adId||''))update.sourceAdId=input.adId;
 if(kind==='electrical_owner')update.trade='Electrical';
 await request('/opportunities/'+op.id,'PATCH',update);
 await followUp(op,update.nextAction,date);
 return op;
}
export async function twentyBooked(input){
 if(!input.email)return;
 const op=await ensureOpportunity(input),date=input.start||today();
 const update={nextAction:'Discovery call',nextActionDate:date.includes('T')?date:date+'T00:00:00Z',lastTouch:today()};
 if(!['CUSTOMER','MAINTENANCE','PROPOSAL'].includes(op.stage))update.stage='SCREENING';
 await request('/opportunities/'+op.id,'PATCH',update);await followUp(op,update.nextAction,date);return op;
}
export async function twentyQuiz({email,uri,answers,submissionId}){
 if(!email)return false;
 const op=await findOpportunity(email);if(!op)return false;
 const marker=`Business quiz submission: ${submissionId||uri}`,id=uuid('website-quiz:'+marker);
 const existing=await findOne('/notes/'+id);
 if(!existing)await createOrGet('notes',id,{title:'Pre-call business quiz — '+op.name,bodyV2:body(`${marker}\n\nBooking: ${uri||'Not booked yet'}\n\n${answers.map(({question,answer})=>`${question}: ${answer}`).join('\n\n')}`)});
 await createOrGet('noteTargets',uuid(id+'targetOpportunityId'+op.id),{noteId:id,targetOpportunityId:op.id});
 if(op.pointOfContactId)await createOrGet('noteTargets',uuid(id+'targetPersonId'+op.pointOfContactId),{noteId:id,targetPersonId:op.pointOfContactId});
 return true;
}

// Native Meta submissions keep booked calls and existing follow-up actions intact.
export async function twentyMetaLead(input){
 const op=await ensureOpportunity(input),date=today();
 const update={};
 if(!op.sourceAdId&&/^\d{8,30}$/.test(input.adId||''))update.sourceAdId=input.adId;
 const industry=input.answers?.find(a=>a.id==='industry')?.answer;
 if(!op.trade&&industry&&industry!=='Not answered')update.trade=industry;
 if(op.stage==='NEW'&&!op.nextAction){
  // Write the deterministic task first, so a failed request retries without losing it.
  await followUp(op,'Call within 5 minutes',date);
  Object.assign(update,{nextAction:'Call within 5 minutes',nextActionDate:date+'T00:00:00Z',lastTouch:date});
 }
 if(Object.keys(update).length)await request('/opportunities/'+op.id,'PATCH',update);
 return op;
}
export async function twentyMetaAnswers({email,name,phone,id,answers=[],at,ad_id,progress=false,channel,crm_ref}){
 if(!email)return false;
 const website=channel==='website';
 const op=website&&crm_ref?.id?crm_ref:await findOpportunity(email);if(!op)return false;
 const noteId=uuid((website?'website-audit-lead:':'meta-audit-lead:')+id);
 const count=answers.filter(a=>a.answer!=='Not answered').length;
 const contactSnapshot=website?`\nName: ${name||'Not supplied'}\nEmail: ${email}\nPhone: ${phone||'Not supplied'}`:'';
 const data={title:(website?'Audit enquiry — ':'Facebook audit enquiry — ')+op.name,bodyV2:body(`${website?'Website audit enquiry':'Facebook lead'}: ${id}\nSubmitted: ${at||'Unknown'}${contactSnapshot}\nSource ad: ${ad_id||'Unknown'}\nAnswered ${count} of 10 optional questions.\n\n${answers.map(({question,answer})=>`${question}: ${answer}`).join('\n\n')}`)};
 await createOrGet('notes',noteId,data);
  if(progress)await request('/notes/'+noteId,'PATCH',data);
 await createOrGet('noteTargets',uuid(noteId+'targetOpportunityId'+op.id),{noteId,targetOpportunityId:op.id});
 if(op.pointOfContactId)await createOrGet('noteTargets',uuid(noteId+'targetPersonId'+op.pointOfContactId),{noteId,targetPersonId:op.pointOfContactId});
 return true;
}
export async function twentyMetaProgress(input){
 if(input.channel==='website'&&!input.crm_ref){
  const op=await twentyMetaLead({...input,adId:input.ad_id,source:'Audit enquiry form'});
  // This reference is stored only on the server. Later answers keep the exact
  // contact even if the record is subsequently classified as a test or client.
  input.crm_ref={id:op.id,name:op.name,pointOfContactId:op.pointOfContactId};
 }
 return twentyMetaAnswers({...input,progress:true});
}
