(() => {
'use strict';
const $=s=>document.querySelector(s), config=window.BLUE_CONFIG, notes=window.BLUE_NOTES;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
let read=new Set();try{read=new Set(JSON.parse(localStorage.getItem('blue-notes-read')||'[]'));}catch{}
function progress(){ $('#read-count').textContent=`${notes.filter(n=>read.has(n.id)).length} / ${notes.length}`;try{localStorage.setItem('blue-notes-read',JSON.stringify([...read]));}catch{} }
function image(target,settings){target.alt=settings.alt;target.referrerPolicy='no-referrer';target.onerror=()=>{if(target.getAttribute('src')!=='assets/silhouette.svg')target.src='assets/silhouette.svg';};target.src=settings.url||'assets/silhouette.svg';}
image($('#standing'),config.standing);image($('#secret-image'),config.secret);
notes.forEach((n,index)=>{
 const card=el('details','note');card.id='note-'+n.id;
 const summary=el('summary');const titles=el('span','note-titles');titles.append(el('small','',n.place),el('strong','',n.title));summary.append(el('span','note-number',n.id),titles,el('span','note-arrow','+'));
 const body=el('div','note-body'),route=el('details','route'),routeSummary=el('summary');routeSummary.append(el('span','','찾아가는 방법'),el('small','','조작법 · 입력값 펼치기 ＋'));route.append(routeSummary,el('p','hand',n.direct));
 const link=el('a','site-link','해당 사이트 열기 ↗');link.href=config.links[n.site];link.target='_blank';link.rel='noopener';route.append(link);
 body.append(route,el('div','thought-label','함께 생각해 볼 것'),el('p','thought hand',n.indirect),el('p','aside-line hand',n.aside));
 const mark=el('div','note-mark'),button=el('button','',read.has(n.id)?'✓ 이 장을 읽었어':'이 장을 읽었어 ○');button.type='button';button.setAttribute('aria-pressed',String(read.has(n.id)));button.onclick=()=>{read.has(n.id)?read.delete(n.id):read.add(n.id);button.setAttribute('aria-pressed',String(read.has(n.id)));button.textContent=read.has(n.id)?'✓ 이 장을 읽었어':'이 장을 읽었어 ○';progress();};mark.append(button);body.append(mark);card.append(summary,body);$('#notes').append(card);
 const nav=el('button');nav.type='button';nav.append(el('span','',n.id),document.createTextNode(n.title));nav.onclick=()=>{card.open=true;card.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});summary.focus({preventScroll:true});};$('#contents').append(nav);
 card.addEventListener('toggle',()=>{nav.classList.toggle('active',card.open);nav.setAttribute('aria-expanded',String(card.open));});nav.setAttribute('aria-controls',card.id);nav.setAttribute('aria-expanded','false');if(index===0)card.open=true;
});
progress();$('#collapse-all').onclick=()=>document.querySelectorAll('.note,.route').forEach(n=>n.open=false);
const dialog=$('#blue-secret');$('#secret-line').textContent=config.secretLine;let busy=false,timer,fadeTimer,previous;
function restore(){clearTimeout(timer);clearTimeout(fadeTimer);dialog.classList.remove('leaving');document.body.classList.remove('secret-open');busy=false;previous?.focus({preventScroll:true});}
function close(){if(!dialog.open)return;dialog.classList.add('leaving');clearTimeout(timer);fadeTimer=setTimeout(()=>dialog.close(),500);}
dialog.addEventListener('close',restore);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
window.addEventListener('keydown',event=>{if(event.ctrlKey&&event.shiftKey&&!event.altKey&&!event.metaKey&&(event.code==='KeyI'||event.key.toLowerCase()==='i')){event.preventDefault();event.stopImmediatePropagation();if(busy||event.repeat)return;busy=true;previous=document.activeElement;dialog.classList.remove('leaving');document.body.classList.add('secret-open');dialog.showModal();timer=setTimeout(close,config.secretDuration);}},true);
})();
