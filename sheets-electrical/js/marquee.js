(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var doc=document.documentElement,body=document.body;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
doc.classList.add('js-m');

/* sticky header + parallax */
var top=$('#top');
function onScroll(){
  top.classList.toggle('small',window.scrollY>40);
  $$('.band>img').forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&!reduce)im.style.setProperty('--par',(r.top*-.1)+'px')});
  curtains();
}
function curtains(){
  var st=$('#stage');if(!st)return;var cl=$('#cl'),cr=$('#cr');var r=st.getBoundingClientRect();
  var p=(innerHeight*.95-r.top)/(innerHeight*.75);p=.72+.28*Math.max(0,Math.min(1,p));
  if(reduce)p=1;
  var open=(innerWidth<700?.97:.9)*p;
  cl.style.setProperty('--cx',(-open*100)+'%');cr.style.setProperty('--cx',(open*100)+'%');
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);

/* marquee bulbs around the hero sign (perimeter chase) */
var bulbHost=$('#signBulbs'),bulbs=[];
function buildBulbs(){
  if(!bulbHost)return;bulbHost.textContent='';bulbs=[];
  var w=bulbHost.clientWidth,h=bulbHost.clientHeight,gap=innerWidth<700?22:34;
  var nx=Math.max(4,Math.round(w/gap)),ny=Math.max(3,Math.round(h/gap));
  function add(x,y){var b=document.createElement('i');b.className='bulb';b.style.left=x+'px';b.style.top=y+'px';bulbHost.appendChild(b);bulbs.push(b)}
  for(var i=0;i<nx;i++)add(w*i/nx,0);
  for(var j=0;j<ny;j++)add(w,h*j/ny);
  for(i=nx;i>0;i--)add(w*i/nx,h);
  for(j=ny;j>0;j--)add(0,h*j/ny);
}
var phase=0;
function chase(){var n=bulbs.length;for(var i=0;i<n;i++){bulbs[i].classList.toggle('on',(i+phase)%3===0)};phase=(phase+1)%3}
buildBulbs();window.addEventListener('resize',buildBulbs);chase();
if(!reduce)setInterval(chase,260);else bulbs.forEach(function(b,i){b.classList.toggle('on',i%2===0)});

/* headline letters light up one by one */
var h1=$('#h1');
if(h1){
  $$('.w1,.w2',h1).forEach(function(w){var t=w.textContent;w.textContent='';t.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.setAttribute('aria-hidden','true');s.textContent=c;w.appendChild(s)})});
  var chs=$$('.ch',h1);
  chs.forEach(function(c,i){setTimeout(function(){c.classList.add('lit')},reduce?0:450+i*85)});
  setTimeout(function(){chs.forEach(function(c,i){if(i%4===1)c.classList.add('flick')})},reduce?0:450+chs.length*85+400);
}

/* now-showing rows: bulb switches */
var rows=$$('.row[data-open]'),master=$('#master');
function setRow(r,on){r.classList.toggle('lit',on);r.setAttribute('data-open',on?'true':'false');var b=$('.open',r);if(b)b.setAttribute('aria-expanded',on?'true':'false')}
rows.forEach(function(r){var b=$('.open',r);b.addEventListener('click',function(){setRow(r,!r.classList.contains('lit'));syncMaster()})});
function syncMaster(){var all=rows.every(function(r){return r.classList.contains('lit')});master.setAttribute('aria-pressed',all?'true':'false');$('span',master).textContent=all?'Lights out':'Light the whole board'}
master.addEventListener('click',function(){var on=master.getAttribute('aria-pressed')!=='true';rows.forEach(function(r,i){setTimeout(function(){setRow(r,on);syncMaster()},reduce?0:i*180)})});

/* reel: drag + arrows */
var film=$('#film');
if(film){
  var down=false,sx=0,sl=0,moved=0;
  film.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')return;down=true;moved=0;sx=e.clientX;sl=film.scrollLeft;film.classList.add('drag');try{film.setPointerCapture(e.pointerId)}catch(_){}});
  film.addEventListener('pointermove',function(e){if(!down)return;moved=Math.abs(e.clientX-sx);film.scrollLeft=sl-(e.clientX-sx)});
  var up=function(){down=false;film.classList.remove('drag')};film.addEventListener('pointerup',up);film.addEventListener('pointercancel',up);
  var frames=$$('.frame',film);
  function cur(){var c=film.scrollLeft+film.clientWidth/2,best=0,bd=1e9;frames.forEach(function(f,i){var m=f.offsetLeft+f.offsetWidth/2,d=Math.abs(m-c);if(d<bd){bd=d;best=i}});return best}
  function go(i){i=Math.max(0,Math.min(frames.length-1,i));var f=frames[i];film.scrollTo({left:f.offsetLeft-(film.clientWidth-f.offsetWidth)/2,behavior:reduce?'auto':'smooth'})}
  $('#prev').addEventListener('click',function(){go(cur()-1)});$('#next').addEventListener('click',function(){go(cur()+1)});
  film.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur()+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(cur()-1)}});
  film.addEventListener('scroll',function(){var n=cur()+1;$('#reelno').textContent='Reel 0'+n+' of 0'+frames.length},{passive:true});
}

/* house lights dimmer */
var hl=$('#housel');
if(hl){hl.addEventListener('input',function(){var v=hl.value/100;doc.style.setProperty('--house',v);bulbs.forEach(function(b){b.style.setProperty('--bl',((1-v)*26)+'px')})})}

/* reveals */
var rv=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});rv.forEach(function(e){io.observe(e)})}else rv.forEach(function(e){e.classList.add('in')});

/* mobile menu */
var burger=$('.burger'),sheet=$('#sheet');
function closeMenu(){if(!sheet.classList.contains('open'))return;sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');body.style.overflow=''}
burger.addEventListener('click',function(){var o=!sheet.classList.contains('open');sheet.classList.toggle('open',o);sheet.setAttribute('aria-hidden',o?'false':'true');burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?'Close menu':'Open menu');body.style.overflow=o?'hidden':''});
$$('a',sheet).forEach(function(a){a.addEventListener('click',closeMenu)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

/* form */
var f=$('#quote');if(f)f.addEventListener('submit',function(e){e.preventDefault()});
onScroll();
})();
