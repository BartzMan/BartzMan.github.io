(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var doc=document.documentElement,body=document.body;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- dusk <-> lit ---- */
var big=$('#bigsw'),mini=$('#minisw'),day=$('#day'),touched=false,lit=false,autoDone=false;
function setLit(v,manual){
  lit=!!v;if(manual)touched=true;
  doc.classList.remove('drag');
  doc.classList.toggle('lit',lit);
  doc.style.setProperty('--t',lit?1:0);
  [big,mini].forEach(function(b){if(b)b.setAttribute('aria-checked',lit?'true':'false')});
  if(day)day.value=lit?100:0;
  var f=$('#flipme');if(f&&manual)body.classList.add('hint-gone');
}
if(big){
  var sy=0,drag=false,moved=false;
  big.addEventListener('pointerdown',function(e){drag=true;moved=false;sy=e.clientY;try{big.setPointerCapture(e.pointerId)}catch(_){}});
  big.addEventListener('pointermove',function(e){if(!drag)return;var dy=e.clientY-sy;if(Math.abs(dy)>14){moved=true;drag=false;setLit(dy<0,true)}});
  big.addEventListener('pointerup',function(){drag=false});
  big.addEventListener('click',function(){if(moved){moved=false;return}setLit(!lit,true)});
}
if(mini)mini.addEventListener('click',function(){setLit(!lit,true)});
if(day){
  day.addEventListener('input',function(){touched=true;doc.classList.add('drag');var v=day.value/100;doc.style.setProperty('--t',v);lit=v>.5;doc.classList.toggle('lit',lit);[big,mini].forEach(function(b){if(b)b.setAttribute('aria-checked',lit?'true':'false')})});
  day.addEventListener('change',function(){doc.classList.remove('drag')});
}
/* the lights come on by themselves once you scroll off the hero, unless you already used a switch */
var hero=$('#hero');
function auto(){
  if(!hero||touched||autoDone)return;
  if(window.scrollY>hero.offsetHeight*.45){autoDone=true;setLit(true,false)}
}

/* ---- header, rail, parallax ---- */
var top=$('#top'),rail=$('#railfill');
function onScroll(){
  var y=window.scrollY,h=doc.scrollHeight-innerHeight,p=h>0?Math.max(0,Math.min(1,y/h)):0;
  if(top)top.classList.toggle('small',y>40);
  if(rail)rail.style.setProperty('--p',(p*100)+'%');
  $$('.band>img').forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&!reduce)im.style.setProperty('--par',(r.top*-.12)+'px')});
  auto();
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);

/* ---- switch plates ---- */
var plates=$$('.pl'),master=$('#master');
function setPlate(p,on){p.classList.toggle('on',on);var b=$('.mini',p);b.setAttribute('aria-checked',on?'true':'false');$('.state',p).textContent=on?'ON':'OFF'}
function sync(){if(!master)return;var all=plates.every(function(p){return p.classList.contains('on')});master.setAttribute('aria-pressed',all?'true':'false');$('span',master).textContent=all?'Flip them all off':'Flip them all'}
plates.forEach(function(p){$('.mini',p).addEventListener('click',function(){setPlate(p,!p.classList.contains('on'));sync()})});
if(master)master.addEventListener('click',function(){var on=master.getAttribute('aria-pressed')!=='true';plates.forEach(function(p,i){setTimeout(function(){setPlate(p,on);sync()},reduce?0:i*140)})});

/* ---- photo strip: drag + arrows ---- */
var strip=$('#strip');
if(strip){
  var down=false,sx=0,sl=0;
  strip.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')return;down=true;sx=e.clientX;sl=strip.scrollLeft;strip.classList.add('drag');try{strip.setPointerCapture(e.pointerId)}catch(_){}});
  strip.addEventListener('pointermove',function(e){if(down)strip.scrollLeft=sl-(e.clientX-sx)});
  var up=function(){down=false;strip.classList.remove('drag')};strip.addEventListener('pointerup',up);strip.addEventListener('pointercancel',up);
  var frames=$$('.ph',strip);
  function cur(){var c=strip.scrollLeft+strip.clientWidth/3,best=0,bd=1e9;frames.forEach(function(f,i){var d=Math.abs(f.offsetLeft-strip.offsetLeft-c+strip.clientWidth/3);if(d<bd){bd=d;best=i}});return best}
  function go(i){i=Math.max(0,Math.min(frames.length-1,i));strip.scrollTo({left:frames[i].offsetLeft-frames[0].offsetLeft,behavior:reduce?'auto':'smooth'})}
  var sp=$('#sprev'),sn=$('#snext');
  if(sp)sp.addEventListener('click',function(){go(cur()-1)});if(sn)sn.addEventListener('click',function(){go(cur()+1)});
  strip.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur()+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(cur()-1)}});
}

/* ---- reveals ---- */
var rv=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});rv.forEach(function(e){io.observe(e)})}else rv.forEach(function(e){e.classList.add('in')});

/* ---- mobile menu ---- */
var burger=$('.burger'),sheet=$('#sheet');
function closeMenu(){if(!sheet||!sheet.classList.contains('open'))return;sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');body.style.overflow=''}
if(burger&&sheet){
  burger.addEventListener('click',function(){var o=!sheet.classList.contains('open');sheet.classList.toggle('open',o);sheet.setAttribute('aria-hidden',o?'false':'true');burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?'Close menu':'Open menu');body.style.overflow=o?'hidden':''});
  $$('a',sheet).forEach(function(a){a.addEventListener('click',closeMenu)});
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

/* ---- 404 mini switch ---- */
var nf=$('#nfsw');
if(nf){nf.addEventListener('click',function(){setLit(!lit,true);$('#nftxt').textContent=lit?'The lights are back on. The page is still missing.':'Lights out. This page was not found.'})}

/* ---- form ---- */
var f=$('#quote');if(f)f.addEventListener('submit',function(e){e.preventDefault()});
onScroll();
})();
