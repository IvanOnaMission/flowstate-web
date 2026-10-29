/* Contact details and answers are saved by the server. Browser storage holds only
   an opaque pending request key and a conversion-event marker, never form fields. */
(() => {
  const endpoint='/.netlify/functions/audit-web';
  const contact=document.querySelector('#contact-step'),question=document.querySelector('#question-step'),complete=document.querySelector('#complete-step');
  const form=document.querySelector('#audit-contact-form'),status=document.querySelector('#audit-save-status'),options=document.querySelector('#answer-options');
  const skip=document.querySelector('#skip-question'),finish=document.querySelector('#finish-questions'),restart=document.querySelector('#new-enquiry');
  const title=document.querySelector('#question-title'),counter=document.querySelector('#question-count'),progress=document.querySelector('#audit-progress');
  let state=null,busy=false,pendingNonce='';
  const params=new URLSearchParams(location.search),utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const attribution=Object.fromEntries(utmKeys.map(k=>[k,(params.get(k)||'').slice(0,200)]));
  document.querySelectorAll('.booking-link').forEach(link=>{const url=new URL(link.href);utmKeys.forEach(k=>{if(attribution[k])url.searchParams.set(k,attribution[k]);});link.href=url.toString();});
  function message(text,error=false){status.textContent=text;status.classList.toggle('error',error);}
  function disable(value){busy=value;form.querySelectorAll('input,button').forEach(el=>{el.disabled=value;});options.querySelectorAll('button').forEach(el=>{el.disabled=value;});skip.disabled=value;finish.disabled=value;restart.disabled=value;}
  async function api(body){
    const response=await fetch(endpoint,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',keepalive:Boolean(body),signal:AbortSignal.timeout?.(20000),headers:body?{'content-type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'We could not confirm that save. Please try again.');return result;
  }
  function render(next,focus=false){
    state=next;contact.hidden=Boolean(next.saved);question.hidden=!next.saved||next.finished;complete.hidden=!next.saved||!next.finished;restart.hidden=!next.saved;
    if(next.saved&&!next.finished)question.insertBefore(status,title);else if(next.finished)complete.appendChild(status);else contact.appendChild(status);
    if(!next.saved)return;
    if(next.finished){document.querySelector('#complete-summary').textContent=next.answered?`Your contact details and ${next.answered} answer${next.answered===1?'':'s'} are saved. Thanks for sharing them.`:'Your contact details are saved. The questions were optional, so you can go straight to booking.';if(focus)document.querySelector('#complete-title').focus();return;}
    counter.textContent=`Optional question ${next.index+1} of 10`;progress.value=next.index;title.textContent=next.question.label;options.replaceChildren();
    next.question.options.forEach((label,choice)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>saveAnswer(choice,button));options.appendChild(button);});
    if(focus)title.focus();
  }
  function nonce(){
    if(pendingNonce)return pendingNonce;
    try{pendingNonce=sessionStorage.getItem('flowstate:audit-pending')||'';}catch{}
    if(!/^[a-f0-9]{64}$/.test(pendingNonce)){const bytes=crypto.getRandomValues(new Uint8Array(32));pendingNonce=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');try{sessionStorage.setItem('flowstate:audit-pending',pendingNonce);}catch{}}
    return pendingNonce;
  }
  function leadEvent(next){
    if(next.test||!['flowstate.net.nz','www.flowstate.net.nz'].includes(location.hostname))return;
    try{if(sessionStorage.getItem('flowstate:audit-lead-event')===next.eventId)return;sessionStorage.setItem('flowstate:audit-lead-event',next.eventId);}catch{}
    if(typeof window.fbq==='function')window.fbq('track','Lead',{content_name:'Free audit'},{eventID:next.eventId});
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||!form.reportValidity())return;disable(true);message('Saving your contact details…');
    try{
      const next=await api({action:'contact',nonce:nonce(),name:form.elements.name.value,email:form.elements.email.value,phone:form.elements.phone.value,company_website:form.elements.company_website.value,attribution,ad_id:params.get('ad_id')||params.get('utm_content')||''});
      form.reset();try{sessionStorage.removeItem('flowstate:audit-pending');}catch{}pendingNonce='';leadEvent(next);render(next,true);message('Your contact details are saved. These questions are optional.');
    }catch(error){message(error.message||'We could not confirm that save. Please try again.',true);}finally{disable(false);}
  });
  async function saveAnswer(choice,button){
    if(busy||!state?.saved)return;disable(true);if(button)button.setAttribute('aria-pressed','true');message('Saving your answer…');
    try{const next=await api({action:'answer',index:state.index,choice});render(next,true);message('Answer saved.');}
    catch(error){message(error.message||'Your answer has not been confirmed. Please try again.',true);}finally{disable(false);}
  }
  skip.addEventListener('click',()=>saveAnswer('skip'));
  finish.addEventListener('click',async()=>{if(busy)return;disable(true);message('Saving…');try{render(await api({action:'finish'}),true);message('Everything you supplied is saved.');}catch(error){message(error.message,true);}finally{disable(false);}});
  restart.addEventListener('click',()=>{if(busy)return;pendingNonce='';try{sessionStorage.removeItem('flowstate:audit-pending');}catch{}render({saved:false});message('');form.elements.name.focus();});
  disable(true);message('Checking for saved progress…');
  api().then(next=>{render(next);message(next.saved?'Your saved enquiry is ready to continue.':'');}).catch(()=>{render({saved:false});message('We could not load saved progress. You can reload or enter your details again.',true);}).finally(()=>disable(false));
})();
