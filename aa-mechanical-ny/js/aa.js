(function(){
var $=function(s,e){return Array.prototype.slice.call((e||document).querySelectorAll(s))};
/* equipment tags */
var tabs=$('.tags [role=tab]'),panels=$('.viewer .panel'),rows=$('.stbl tr[data-row]'),ghost=document.getElementById('ghost');
function pick(t){tabs.forEach(function(b){var on=b===t;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
panels.forEach(function(p){p.hidden=p.id!==t.getAttribute('aria-controls')});
rows.forEach(function(r){r.classList.toggle('on',r.getAttribute('data-row')===t.id)});
if(ghost)ghost.textContent=t.getAttribute('data-ghost')}
tabs.forEach(function(b,i){b.addEventListener('click',function(){pick(b)});
b.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!n)return;e.preventDefault();var t=tabs[(i+n+tabs.length)%tabs.length];pick(t);t.focus()})});
rows.forEach(function(r){r.addEventListener('click',function(){pick(document.getElementById(r.getAttribute('data-row')))})});
/* services switch */
var sw=$('.switch [data-svc]');
sw.forEach(function(b){b.addEventListener('click',function(){sw.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
['com','res'].forEach(function(k){var el=document.getElementById('svc-'+k);el.hidden=k!==b.getAttribute('data-svc');if(!el.hidden){el.classList.add('kit-in')}})})});
/* checklist */
var cb=$('#signoff input'),cnt=document.getElementById('count'),fill=document.getElementById('fill'),st=document.getElementById('stamp');
function upd(){var n=cb.filter(function(c){return c.checked}).length;cnt.textContent=n+' of '+cb.length;fill.style.width=(n/cb.length*100)+'%';st.classList.toggle('on',n===cb.length)}
cb.forEach(function(c){c.addEventListener('change',upd)});
})();
