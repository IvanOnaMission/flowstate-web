
const hero=document.querySelector('.hero');
if(hero){
hero.querySelector('h1').innerHTML='Get your quoting<br>out of your <em>evenings.</em>';
const benefits=document.createElement('div');benefits.className='benefits';hero.querySelectorAll('.promise').forEach(p=>benefits.append(p));hero.after(benefits);
const stage=document.createElement('div');stage.className='book-stage';stage.setAttribute('aria-label','Illustrated cover of the quoting workbook');stage.innerHTML='<div class="note note-left" aria-hidden="true"><small>YOUR KNOW-HOW</small>Job notes. Pricing. Process.</div><div class="book" aria-hidden="true"><span class="book-brand">FLOW STATE ↗</span><div class="book-title">Get your<br>quoting out of<br>your evenings.</div><div class="book-bottom"><span>THE QUOTING WORKBOOK<br>YOUR KNOW-HOW. LESS REPEAT WORK.</span><span>↗</span></div></div><div class="note note-right" aria-hidden="true"><small>YOUR WAY OF WORKING</small><b>✓</b> Saved. Ready for the next job.</div><span class="book-caption">15 pages · 11 AI prompts · Your way of quoting</span>';hero.firstElementChild.append(stage);
const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');stage.addEventListener('pointermove',e=>{if(motion.matches||!fine.matches)return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.setProperty('--rx',`${8-y*15}deg`);stage.style.setProperty('--ry',`${-16+x*24}deg`);stage.style.setProperty('--nx',`${x*-12}px`);stage.style.setProperty('--ny',`${y*-12}px`)});stage.addEventListener('pointerleave',()=>{['--rx','--ry','--nx','--ny'].forEach(p=>stage.style.removeProperty(p))});

}
