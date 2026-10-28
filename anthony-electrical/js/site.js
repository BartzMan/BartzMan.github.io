(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* header + trace */
  var bar=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;bar.classList.toggle('solid',y>40);bar.style.setProperty('--p',h>0?Math.min(1,y/h).toFixed(4):0)}
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

  /* oscilloscope */
  var SV=[
    {t:'Lighting',img:'sconces-recessed',w:1600,h:900,alt:'Room with recessed ceiling lights and two wall sconces beside a white door',p:'Recessed lights, sconces and flush mounts, wired and switched where you want them.',c:'Job photo · recessed lights and sconces'},
    {t:'Ceiling fans',img:'ceiling-fan',w:1600,h:2133,alt:'Ceiling fan with dark blades and a light kit in a grey bedroom',p:'Fans hung from the ceiling with the light kit wired in, so one switch does both jobs.',c:'Job photo · ceiling fan with a light'},
    {t:'Vanity and bath lighting',img:'vanity-glass',w:1600,h:900,alt:'Two-bulb vanity light with clear glass shades on a black bar',p:'Vanity bars and wall lights over the mirror, set at a height that looks right.',c:'Job photo · vanity light with glass shades'},
    {t:'Fixtures and chandeliers',img:'crystal-drum',w:1600,h:828,alt:'Crystal drum light fixture on a dark patterned ceiling',p:'Crystal drums, pendants and statement fixtures hung and wired safely.',c:'Job photo · crystal drum fixture'},
    {t:'Repairs and panel upgrades',img:'stock-copper',w:1600,h:1200,alt:'Coil of copper wire glowing orange in the dark',p:'Electrical repairs, panel upgrades and installs. Photo is an illustrative stock shot of copper wire.',c:'Illustrative stock · copper coil'}
  ];
  var screen=$('#screen'),wp=$('#wave-p'),wg=$('#wave-g'),hw=$('#hero-wave');
  var f=2,tf=2,phase=0,drag=false,sx=0,sf=0,cur=-1;
  function pts(freq,ph,W,H,amp,n){var d='';for(var i=0;i<=n;i++){var x=i/n,y=H/2-amp*(Math.sin(2*Math.PI*freq*x+ph)+.18*Math.sin(2*Math.PI*freq*3*x+ph*1.7)/1);d+=(i?'L':'M')+(x*W).toFixed(1)+' '+y.toFixed(1)}return d}
  function pick(i){
    i=Math.max(0,Math.min(4,i));if(i===cur)return;cur=i;var s=SV[i];
    $$('#stops button').forEach(function(b,k){b.classList.toggle('on',k===i)});
    $('#svc-t').textContent=s.t;$('#svc-p').textContent=s.p;$('#svc-c').textContent=s.c;$('#svc-n').textContent='F'+(i+1);$('#svc-ch').textContent='CH1 · '+(i+1)+' cycle'+(i?'s':'');
    var im=$('#svc-img');im.classList.add('swap');
    setTimeout(function(){im.src='images/'+s.img+'.jpg';im.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+(s.img==='stock-copper'?1600:1600)+'w';im.width=s.w;im.height=s.h;im.alt=s.alt;var d=function(){im.classList.remove('swap')};im.onload=d;setTimeout(d,500)},reduce?0:240);
    screen.setAttribute('aria-valuenow',i+1);screen.setAttribute('aria-valuetext',(i+1)+' cycles, '+s.t.toLowerCase());
  }
  function frame(){
    phase+=reduce?0:.035;f+=(tf-f)*.14;
    var d=pts(f,phase,1000,400,150,420);wp.setAttribute('d',d);wg.setAttribute('d',d);
    if(hw)hw.setAttribute('d',pts(f,phase*.8,400,200,64,200));
    var hz=f.toFixed(1);$('#hz').textContent=hz+' cycles';$('#hz-hero').textContent=hz;
    requestAnimationFrame(frame);
  }
  function setT(v,snap){tf=Math.max(.8,Math.min(5.4,v));if(snap)tf=Math.max(1,Math.min(5,Math.round(tf)));pick(Math.round(tf)-1)}
  screen.addEventListener('pointerdown',function(e){drag=true;screen.setPointerCapture(e.pointerId);sx=e.clientX;sf=tf;screen.focus({preventScroll:true})});
  screen.addEventListener('pointermove',function(e){if(!drag)return;var r=screen.getBoundingClientRect();setT(sf+(e.clientX-sx)/r.width*5,false)});
  function up(){if(!drag)return;drag=false;setT(tf,true)}
  screen.addEventListener('pointerup',up);screen.addEventListener('pointercancel',up);
  screen.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){setT(Math.round(tf)+1,true);e.preventDefault()}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){setT(Math.round(tf)-1,true);e.preventDefault()}
  });
  $('#f-more').addEventListener('click',function(){setT(Math.round(tf)+1,true)});
  $('#f-less').addEventListener('click',function(){setT(Math.round(tf)-1,true)});
  $$('#stops button').forEach(function(b){b.addEventListener('click',function(){setT(+b.dataset.i+1,true)})});
  pick(1);requestAnimationFrame(frame);

  /* dimmer */
  var dm=$('#dim'),ds=$('#dimmer');
  dm.addEventListener('input',function(){ds.style.setProperty('--dim',dm.value/100);$('#dim-n').textContent=dm.value});

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function g(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(5*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(g)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Signal received. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
