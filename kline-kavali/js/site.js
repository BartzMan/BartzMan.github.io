(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

  /* header + mini gauge */
  var hdr=$('#top'),mini=$('#mini-n');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight,p=h>0?clamp(y/h,0,1):0;hdr.classList.toggle('solid',y>40);mini.style.transform='rotate('+(-120+p*240)+'deg)'}
  addEventListener('scroll',sc,{passive:true});sc();

  /* sheet */
  var bg=$('.burger'),sh=$('#sheet');
  function setM(o){bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Close menu':'Open menu');sh.hidden=!o;document.body.style.overflow=o?'hidden':''}
  bg.addEventListener('click',function(){setM(sh.hidden)});
  $$('a',sh).forEach(function(a){a.addEventListener('click',function(){setM(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sh.hidden){setM(false);bg.focus()}});

  /* reveal */
  var rv=$$('.rise');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    rv.forEach(function(n){io.observe(n)});
  }else rv.forEach(function(n){n.classList.add('in')});

  /* brass gauge svg builder */
  function gauge(a0){
    var t='';
    for(var k=0;k<=30;k++){var a=(-135+k*9)*Math.PI/180,r1=k%5===0?64:72,r2=80;t+='<line x1="'+(100+r1*Math.sin(a)).toFixed(1)+'" y1="'+(100-r1*Math.cos(a)).toFixed(1)+'" x2="'+(100+r2*Math.sin(a)).toFixed(1)+'" y2="'+(100-r2*Math.cos(a)).toFixed(1)+'" stroke="#2b3338" stroke-width="'+(k%5===0?3:1.6)+'"/>'}
    return '<svg class="gsvg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96" fill="#c8a24a" stroke="#0f1316" stroke-width="4"/><circle cx="100" cy="100" r="86" fill="#f1efe6" stroke="#6d531a" stroke-width="3"/><path d="M52 154a70 70 0 0 1-12-18M160 136a70 70 0 0 1-12 18" fill="none" stroke="#2b3338" stroke-width="0"/><path d="M143 148A62 62 0 0 0 162 118" fill="none" stroke="#d4342c" stroke-width="7"/>'+t+'<g class="needle" style="--a:'+a0+'deg"><path d="M100 100 100 30" stroke="#d4342c" stroke-width="5" stroke-linecap="round"/><path d="M100 100 100 118" stroke="#d4342c" stroke-width="5" stroke-linecap="round"/></g><circle cx="100" cy="100" r="9" fill="#2b3338" stroke="#0f1316" stroke-width="2"/><circle cx="100" cy="100" r="3" fill="#c8a24a"/></svg>';
  }
  var hg=$('#hero-gauges');hg.innerHTML=gauge(-40)+gauge(10)+gauge(55);
  var big=$$('.gauge');big.forEach(function(g){g.innerHTML=gauge(-135)});
  var gs=$('#g-row');
  function needles(){
    var r=gs.getBoundingClientRect(),p=reduce?1:clamp((innerHeight*.95-r.top)/(r.height*.9),0,1);
    gs._m=Math.max(gs._m||0,p);
    big.forEach(function(g){var v=+g.dataset.v;$('.needle',g).style.setProperty('--a',(-135+270*v*gs._m)+'deg')})
  }
  addEventListener('scroll',needles,{passive:true});addEventListener('resize',needles);needles();

  /* valve wheels */
  var V=[
    {t:'Supply lines',img:'supply-valve',w:1600,h:3463,alt:'Chrome water supply valve and braided hose mounted on a wall beside a black pipe',p:'Water supply valves and braided hoses, connected and tight where the pipe meets the fixture. Photo of a chrome valve and hose on a wall.',c:'Job photo · supply valve and hose'},
    {t:'Fixtures & hoses',img:'supply-hose',w:1600,h:3463,alt:'Braided supply hose with a chrome connector coming off the wall under a sink',p:'Braided supply hoses and connectors under sinks and fixtures, set up neat and ready. Photo of a hose connector under a sink.',c:'Job photo · hose connector under a sink'},
    {t:'Piping & valves',img:'stock-valves',w:1600,h:900,alt:'Row of hand-wheel valves on red and blue industrial pipes',p:'Runs of pipe with a hand-wheel valve at every branch. Illustrative stock photo of valves on a pipe run.',c:'Illustrative stock · hand-wheel valves'},
    {t:'Boilers',img:'stock-boiler',w:1600,h:1067,alt:'Old boiler with brass fittings, rivets and a round hatch',p:'Boiler rooms, boilers and the brass and steel around them. Illustrative stock photo of an old riveted boiler.',c:'Illustrative stock · old boiler with brass fittings'},
    {t:'Repairs & installs',img:'supply-valve',w:1600,h:3463,alt:'Chrome water supply valve and braided hose on a wall',p:'Repairs and new installs, from a single valve to a full line. Photo of a valve and hose connection.',c:'Job photo · valve and hose connection'}
  ];
  var vs=$$('.valve'),man=$('.manifold'),pi=$('#port-img'),busy,spin=0;
  function open(i){
    var s=V[i];spin+=300;
    vs.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i);if(k===i)b.style.setProperty('--rot',spin+'deg')});
    man.classList.add('flow');
    $('#dk-n').textContent='Valve 0'+(i+1)+' · open';$('#dk-t').textContent=s.t;$('#dk-p').textContent=s.p;$('#dk-c').textContent=s.c;
    pi.classList.add('swap');clearTimeout(busy);
    busy=setTimeout(function(){pi.src='images/'+s.img+'.jpg';pi.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+s.w+'w';pi.width=s.w;pi.height=s.h;pi.alt=s.alt;var d=function(){pi.classList.remove('swap')};pi.onload=d;setTimeout(d,500)},reduce?0:260);
  }
  vs.forEach(function(b,i){b.addEventListener('click',function(){open(i)})});
  man.classList.add('flow');

  /* rating gauge */
  var rn=$('#rn'),rneedle=$('#rate-needle');
  function setRate(v){rn.textContent=v.toFixed(1);rneedle.style.transform='rotate('+(-90+(v/5)*180)+'deg)'}
  setRate(reduce?4.7:0);
  if('IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-p,3);setRate(4.7*e);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.5});i2.observe($('.rg'));
  }else setRate(4.7);

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Line opened. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
