(function(){
'use strict';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var body=document.body;

/* header + footage counter + rail + pipe fill */
var hud=$('#top'),ftEl=$('#ft'),ft2=$('#ft2'),stn=$('#stn'),cam=$('.rail .cam'),pipe=$('#pipe');
var sections=$$('[data-ft][data-name]');
function pad(n){return ('000'+n.toFixed(1)).slice(-5)}
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  var p=h>0?Math.min(1,Math.max(0,y/h)):0;
  hud.classList.toggle('is-stuck',y>30);
  var feet=p*100; var s=pad(feet);
  if(ftEl)ftEl.textContent=s; if(ft2)ft2.textContent=s;
  $$('.ftv').forEach(function(e){e.textContent=s});
  if(cam){var rh=window.innerHeight-70-60;cam.style.transform='translateY('+(p*Math.max(0,rh-34))+'px)'}
  var cur='ENTRY';
  sections.forEach(function(sec){var r=sec.getBoundingClientRect();if(r.top<window.innerHeight*.45)cur=sec.getAttribute('data-name').toUpperCase()});
  if(stn)stn.textContent=cur;
  if(pipe){var r=pipe.getBoundingClientRect();var f=(window.innerHeight*.55-r.top)/r.height;pipe.style.setProperty('--run',(Math.min(1,Math.max(0,f))*100)+'%')}
  $$('.band>img').forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight&&!reduce){im.style.setProperty('--par',((r.top)*-.08)+'px')}});
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();

/* REC clock */
var t0=Date.now();
function two(n){return (n<10?'0':'')+n}
setInterval(function(){var s=Math.floor((Date.now()-t0)/1000),str=two(Math.floor(s/3600))+':'+two(Math.floor(s/60)%60)+':'+two(s%60);
  var c=$('#clock');if(c)c.textContent=str;$$('.clk').forEach(function(e){e.textContent=str})},1000);

/* pan / tilt: drag the lens, idle drift when untouched */
var pans=$$('[data-pan]');
pans.forEach(function(el,idx){
  var box=el.classList.contains('lens')?el.parentNode:el;
  var st={x:0,y:0,tx:0,ty:0,drag:false,sx:0,sy:0,ox:0,oy:0,touched:false,ph:Math.random()*6};
  function set(){box.style.setProperty('--px',st.x.toFixed(3));box.style.setProperty('--py',st.y.toFixed(3));
    var pe=$$('.pan',box),te=$$('.tilt',box);
    pe.forEach(function(e){e.textContent=(st.x>=0?'+':'-')+two(Math.round(Math.abs(st.x)*45))});
    te.forEach(function(e){e.textContent=(st.y>=0?'+':'-')+two(Math.round(Math.abs(st.y)*30))})}
  el.addEventListener('pointerdown',function(e){st.drag=true;st.touched=true;st.sx=e.clientX;st.sy=e.clientY;st.ox=st.tx;st.oy=st.ty;try{el.setPointerCapture(e.pointerId)}catch(_){}
    var h=$('.hint',box);if(h)h.classList.add('gone')});
  el.addEventListener('pointermove',function(e){if(!st.drag)return;var r=el.getBoundingClientRect();
    st.tx=Math.max(-1,Math.min(1,st.ox+(e.clientX-st.sx)/r.width*2.6));st.ty=Math.max(-1,Math.min(1,st.oy+(e.clientY-st.sy)/r.height*2.6))});
  var end=function(){st.drag=false};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  el.addEventListener('keydown',function(e){var k=e.key,d=.25;if(k==='ArrowLeft')st.tx=Math.max(-1,st.tx-d);else if(k==='ArrowRight')st.tx=Math.min(1,st.tx+d);else if(k==='ArrowUp')st.ty=Math.max(-1,st.ty-d);else if(k==='ArrowDown')st.ty=Math.min(1,st.ty+d)});
  el.setAttribute('tabindex','0');el.setAttribute('role','group');el.setAttribute('aria-label','Scope viewer. Drag or use arrow keys to pan.');
  var vis=true;if('IntersectionObserver' in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting},{threshold:0}).observe(box)}
  (function loop(t){requestAnimationFrame(loop);if(!vis)return;
    if(!st.touched&&!reduce){st.tx=Math.sin(t/2600+st.ph)*.55;st.ty=Math.cos(t/3300+st.ph)*.35}
    st.x+=(st.tx-st.x)*.08;st.y+=(st.ty-st.y)*.08;set()})(0);
});

/* camera mode (colour / night IR), synced across the page */
function setMode(m){body.classList.toggle('ir',m==='ir');
  $$('[data-mode]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-mode')===m?'true':'false')});
  $$('.irtxt').forEach(function(e){e.textContent=m==='ir'?'IR ON':(e.closest('.wide')?'COLOUR':'OFF')})}
$$('[data-mode]').forEach(function(b){b.addEventListener('click',function(){setMode(b.getAttribute('data-mode'))})});

/* lamp slider */
var lit=$('#lit'),wide=$('#wide');
if(lit&&wide){lit.addEventListener('input',function(){var v=lit.value;wide.style.setProperty('--lit',v/100);$('#litv').textContent=v+'%';$('#litv2').textContent=v})}

/* scroll reveals */
var rv=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});rv.forEach(function(e){io.observe(e)})}else{rv.forEach(function(e){e.classList.add('in')})}

/* snapshots + lightbox */
var lb=$('#lb'),lbimg=$('#lbimg'),flash=$('#flash'),lastFocus=null;
function openLB(name,w,h,ft,cap,alt){
  lastFocus=document.activeElement;
  if(flash&&!reduce){flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go')}
  lbimg.src='images/'+name+'-1600.jpg';lbimg.width=w;lbimg.height=h;lbimg.alt=alt||cap;
  $('#lbft').textContent='FT '+ft;$('#lbcap').textContent=cap;
  lb.classList.add('open');body.style.overflow='hidden';$('.close',lb).focus()}
function closeLB(){lb.classList.remove('open');body.style.overflow='';if(lastFocus)lastFocus.focus()}
$$('.snap').forEach(function(b){b.addEventListener('click',function(){var n=b.getAttribute('data-snap');var im=$('img[src*="images/'+n+'-"]');openLB(n,n==='mech'?1024:(n==='trench'?1439:1600),n==='mech'?575:(n==='trench'?809:1200),b.getAttribute('data-ft'),b.getAttribute('data-cap'),im?im.alt:'')})});
$$('.gal .open').forEach(function(b){b.addEventListener('click',function(){var f=b.closest('figure'),im=$('img',f),cap=$('figcaption',f);openLB(b.getAttribute('data-lb'),+b.getAttribute('data-w'),+b.getAttribute('data-h'),'0'+(10+Math.floor(Math.random()*80))+'.0',cap?cap.textContent:'',im.alt)})});
if(lb){lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('close'))closeLB()});document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(lb.classList.contains('open'))closeLB();closeMenu()}})}

/* mobile menu */
var burger=$('.burger'),sheet=$('#sheet');
function closeMenu(){if(!sheet.classList.contains('open'))return;sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');body.style.overflow=''}
burger.addEventListener('click',function(){var o=!sheet.classList.contains('open');sheet.classList.toggle('open',o);sheet.setAttribute('aria-hidden',o?'false':'true');burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?'Close menu':'Open menu');body.style.overflow=o?'hidden':''});
$$('a',sheet).forEach(function(a){a.addEventListener('click',closeMenu)});
if(sheet){$$('a,button',sheet).forEach(function(e){e.tabIndex=0})}

/* form */
var f=$('#quote');if(f){f.addEventListener('submit',function(e){e.preventDefault()})}
})();
