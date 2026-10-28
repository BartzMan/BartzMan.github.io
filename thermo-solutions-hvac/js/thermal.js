(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var doc=document.documentElement,body=document.body;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;

/* header, scale marker, progress, parallax */
var bar=$('#top'),mk=$('#mk'),rd=$('#rd'),progi=$('#progi');
function onScroll(){
  var y=window.scrollY,h=doc.scrollHeight-innerHeight,p=h>0?Math.max(0,Math.min(1,y/h)):0;
  bar.classList.toggle('small',y>40);
  var temp=Math.round(38+p*34); if(rd)rd.textContent=temp+'°F';
  if(mk){var gr=$('.scale .gr');var top=gr.offsetTop,hh=gr.offsetHeight;mk.style.top=(top+hh*(1-p))+'px'}
  if(progi)progi.style.setProperty('--w',(p*100)+'%');
  $$('.band>img').forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&!reduce)im.style.setProperty('--par',(r.top*-.1)+'px')});
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);

/* hero thermal lens: follows hover, draggable on touch, roams when idle */
var hero=$('#hero'),lens=$('#lens'),hot=$('#heroHot'),ph=$('#heroImg'),lr=$('#lr');
var L={x:0,y:0,tx:0,ty:0,drag:false,idle:true,last:0,ld:300,cw:0,ch:0};
var sample=null;
function prepSample(){
  try{var c=document.createElement('canvas');c.width=64;c.height=48;var x=c.getContext('2d');var im=new Image();im.onload=function(){try{x.drawImage(im,0,0,64,48);var d=x.getImageData(0,0,64,48).data;sample=function(u,v){var i=(Math.max(0,Math.min(47,Math.round(v*47)))*64+Math.max(0,Math.min(63,Math.round(u*63))))*4;return (d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255}}catch(e){sample=null}};im.src=ph.currentSrc||ph.src}catch(e){sample=null}
}
function layout(){
  var r=hero.getBoundingClientRect();L.cw=r.width;L.ch=r.height;L.ld=Math.max(190,Math.min(340,r.width*.24));
  hero.style.setProperty('--ld',L.ld+'px');hero.style.setProperty('--cw',r.width+'px');hero.style.setProperty('--ch',r.height+'px');
  lens.style.setProperty('--cw',r.width+'px');lens.style.setProperty('--ch',r.height+'px');
  if(!L.x){L.x=L.tx=r.width*(innerWidth<760?.55:.68);L.y=L.ty=r.height*(innerWidth<760?.7:.5)}
}
function place(){
  var ox=-(L.x-L.ld/2),oy=-(L.y-L.ld/2);
  hero.style.setProperty('--lx',L.x+'px');hero.style.setProperty('--ly',L.y+'px');
  lens.style.setProperty('--ox',ox+'px');lens.style.setProperty('--oy',oy+'px');
  var t;
  if(sample){var u=L.x/L.cw,v=L.y/L.ch;
    /* image is object-fit:cover at 60% 50% on a 4:3 source */
    var ir=4/3,cr=L.cw/L.ch,su=u,sv=v;
    if(cr>ir){sv=.5+(v-.5)*(ir/cr)}else{su=.6+(u-.6)*(cr/ir)}
    t=44+sample(su,sv)*58}
  else t=58+34*(.5+.5*Math.sin(L.x/90)*Math.cos(L.y/110));
  lr.textContent=Math.round(t)+'°F';
}
if(hero&&lens){
  layout();prepSample();place();
  window.addEventListener('resize',function(){L.x=0;layout();place()});
  hero.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=hero.getBoundingClientRect();L.tx=e.clientX-r.left;L.ty=e.clientY-r.top;L.idle=false;L.last=performance.now()});
  hero.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')L.idle=true});
  lens.addEventListener('pointerdown',function(e){L.drag=true;L.idle=false;try{lens.setPointerCapture(e.pointerId)}catch(_){}});
  lens.addEventListener('pointermove',function(e){if(!L.drag)return;var r=hero.getBoundingClientRect();L.tx=e.clientX-r.left;L.ty=e.clientY-r.top;L.x=L.tx;L.y=L.ty});
  var end=function(){L.drag=false;L.last=performance.now()};lens.addEventListener('pointerup',end);lens.addEventListener('pointercancel',end);
  var vis=true;if('IntersectionObserver' in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting}).observe(hero)}
  (function loop(t){requestAnimationFrame(loop);if(!vis)return;
    if(!L.drag&&(L.idle||t-L.last>3500)&&!reduce){var r=hero.getBoundingClientRect();L.idle=true;L.tx=r.width*(innerWidth<760?.5+.3*Math.sin(t/1900):.66+.2*Math.sin(t/2300));L.ty=r.height*(innerWidth<760?.7+.05*Math.cos(t/2100):.5+.2*Math.cos(t/2800))}
    if(!L.drag){L.x+=(L.tx-L.x)*.09;L.y+=(L.ty-L.y)*.09}
    place()})(0);
}

/* service tiles + master heat switch */
$$('.tile').forEach(function(t){var b=$('.tg',t);b.addEventListener('click',function(){var on=!t.classList.contains('on');t.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false')})});
var master=$('#master');
master.addEventListener('click',function(){var on=master.getAttribute('aria-pressed')!=='true';master.setAttribute('aria-pressed',on?'true':'false');doc.classList.toggle('th-on',on);$$('.tile').forEach(function(t){t.classList.toggle('on',on);$('.tg',t).setAttribute('aria-pressed',on?'true':'false')})});

/* wipe + thermostat */
var wipe=$('#wipe'),wi=$('#wipeIn');
if(wipe){wi.addEventListener('input',function(){wipe.style.setProperty('--x',wi.value+'%')});
  var stat=$('#stat');stat.addEventListener('input',function(){wipe.style.setProperty('--heat',stat.value);$('#statv').textContent=stat.value+'°F'})}

/* rating gauge */
var ring=$('#ring');if(ring){ring.style.setProperty('--fill',(270*4.7/5)+'deg')}

/* reveals */
var rv=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});rv.forEach(function(e){io.observe(e)})}else rv.forEach(function(e){e.classList.add('in')});

/* mobile menu */
var burger=$('.burger'),sheet=$('#sheet');
function closeMenu(){if(!sheet.classList.contains('open'))return;sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');body.style.overflow=''}
burger.addEventListener('click',function(){var o=!sheet.classList.contains('open');sheet.classList.toggle('open',o);sheet.setAttribute('aria-hidden',o?'false':'true');burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?'Close menu':'Open menu');body.style.overflow=o?'hidden':''});
$$('a',sheet).forEach(function(a){a.addEventListener('click',closeMenu)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

var f=$('#quote');if(f)f.addEventListener('submit',function(e){e.preventDefault()});
onScroll();
})();
