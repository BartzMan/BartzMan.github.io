(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

  /* header + moulding progress */
  var hdr=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('solid',y>40);hdr.style.setProperty('--p',h>0?clamp(y/h,0,1).toFixed(4):0)}
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

  /* finish-level slider */
  var ST=[
    {t:'Hung',p:'Sheets of board screwed to the framing, seams still open. Photo of a hung soffit and ceiling.',c:'Job photo · hung soffit and ceiling'},
    {t:'Taped',p:'Paper tape laid over every seam so the joints hold. Photo of an eight-sided ceiling with taped seams.',c:'Job photo · taped eight-sided ceiling'},
    {t:'Mudded',p:'Compound worked over seams, screws and tape in strips. Photo of walls and a soffit with mud strips.',c:'Job photo · joint compound on the seams'},
    {t:'Textured',p:'A finished texture on a soffit, with the lights cut in. Photo of a textured soffit box.',c:'Job photo · textured soffit'},
    {t:'Finished',p:'Smooth walls, lights in and flooring down, ready for paint and trim. Photo of a finished room.',c:'Job photo · finished room'}
  ];
  var imgs=$$('.st-ph img'),rng=$('#lvl'),tks=$$('#ticks button');
  function stage(n){
    n=clamp(+n,1,5);var s=ST[n-1];
    imgs.forEach(function(i){i.classList.toggle('on',+i.dataset.s===n)});
    tks.forEach(function(b){b.classList.toggle('on',+b.dataset.s===n)});
    rng.value=n;rng.setAttribute('aria-valuetext','Stage '+n+', '+s.t.toLowerCase());
    $('#st-no').textContent=n;$('#st-lab').textContent='Stage '+n+' of 5';$('#st-t').textContent=s.t;$('#st-p').textContent=s.p;$('#st-c').textContent=s.c;
  }
  rng.addEventListener('input',function(){stage(rng.value)});
  tks.forEach(function(b){b.addEventListener('click',function(){stage(b.dataset.s)})});
  if('IntersectionObserver' in window&&!reduce){
    var auto=false,aio=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!auto){auto=true;var k=1;var t=setInterval(function(){k++;if(k>3||rng._touched){clearInterval(t);if(!rng._touched)stage(1);return}stage(k)},900)}},{threshold:.5});
    aio.observe($('#stage'));
    ['pointerdown','keydown'].forEach(function(e){rng.addEventListener(e,function(){rng._touched=true})});
    tks.forEach(function(b){b.addEventListener('click',function(){rng._touched=true})});
  }

  /* gallery filter */
  var chips=$$('.chip'),gs=$$('.g');
  var MAP={all:null,hang:['hang'],tape:['tape'],fin:['fin']};
  chips.forEach(function(c){c.addEventListener('click',function(){
    chips.forEach(function(x){x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
    var f=c.dataset.f;gs.forEach(function(g){g.classList.toggle('hide',f!=='all'&&g.dataset.g!==f)});
  })});

  /* seal burst */
  var b=$('#burst'),pts=[];
  for(var i=0;i<48;i++){var a=i*Math.PI/24,r=i%2?92:98;pts.push((100+r*Math.cos(a)).toFixed(1)+','+(100+r*Math.sin(a)).toFixed(1))}
  b.setAttribute('points',pts.join(' '));

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(5*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Audience granted. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
