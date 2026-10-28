(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var NS='http://www.w3.org/2000/svg';

  /* header + bearing bar */
  var top=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;top.classList.toggle('solid',y>40);top.style.setProperty('--p',h>0?Math.min(1,y/h).toFixed(4):0)}
  addEventListener('scroll',sc,{passive:true});sc();

  /* sheet */
  var bg=$('.burger'),sh=$('#sheet');
  function setM(o){bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Close menu':'Open menu');sh.hidden=!o;document.body.style.overflow=o?'hidden':''}
  bg.addEventListener('click',function(){setM(sh.hidden)});
  $$('a',sh).forEach(function(a){a.addEventListener('click',function(){setM(false)})});

  /* reveal */
  var rv=$$('.rise');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    rv.forEach(function(n){io.observe(n)});
  }else rv.forEach(function(n){n.classList.add('in')});

  /* reticle ticks */
  var rt=$('#r-ticks');
  for(var a=0;a<360;a+=10){var r=a*Math.PI/180,l=a%30===0?16:9;var ln=document.createElementNS(NS,'line');
    ln.setAttribute('x1',200+176*Math.sin(r));ln.setAttribute('y1',200-176*Math.cos(r));ln.setAttribute('x2',200+(176-l)*Math.sin(r));ln.setAttribute('y2',200-(176-l)*Math.cos(r));ln.setAttribute('stroke-width',a%30===0?3:1.5);rt.appendChild(ln)}

  /* crosshair cursor */
  var xh=$('#xhair');
  if(matchMedia('(hover:hover)').matches&&!reduce){
    var tx=0,ty=0,cx=0,cy=0,run=false;
    addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;xh.classList.add('on');if(!run){run=true;loop()}});
    document.addEventListener('pointerleave',function(){xh.classList.remove('on')});
    function loop(){cx+=(tx-cx)*.28;cy+=(ty-cy)*.28;xh.style.transform='translate('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px)';requestAnimationFrame(loop)}
    document.addEventListener('pointerover',function(e){var t=e.target.closest&&e.target.closest('a,button,input,textarea,.screen');xh.classList.toggle('lock',!!t)});
  }

  /* targets: snap into focus */
  var T=[
    {t:'Sump pumps',n:'Target 01',img:'sump-pump',w:1600,h:2133,alt:'Sump pump in a basin with white and yellow pipe running up a brick basement wall',p:'A sump pump in its basin with the discharge pipe run up the wall. The kind of job that matters when the basement could take on water.',c:'Job photo · sump pump and discharge pipe'},
    {t:'Bathrooms',n:'Target 02',img:'bath-shower',w:1600,h:2133,alt:'Small bathroom with a toilet, pedestal sink and a tiled shower with grab bar',p:'Toilets, pedestal sinks and showers in a small bathroom, plumbed and sealed up clean.',c:'Job photo · small bathroom with shower'},
    {t:'Kitchens and sinks',n:'Target 03',img:'kitchen-sink',w:1600,h:2133,alt:'Double stainless steel kitchen sink with a pull-down faucet under a window',p:'Double sinks and pull-down faucets set in the counter, with the drains and supply lines done right underneath.',c:'Job photo · double kitchen sink'},
    {t:'Drains and cleanouts',n:'Target 04',img:'drain-cleanout',w:1600,h:2133,alt:'Open white drain pipe with a cleanout plug being removed beside old brick',p:'Cleanouts opened and drain lines checked, even when the access is tight against old brick.',c:'Job photo · drain cleanout'},
    {t:'Roots and lines',n:'Target 05',img:'roots-pavement',w:1400,h:1859,alt:'Dark tree roots running across cracked grey pavement',p:'When roots are heading where the pipes are. Photo of roots running across cracked pavement.',c:'Job photo · roots across cracked pavement'}
  ];
  var tg=$$('.tgt'),vf=$('.vf'),im=$('#vf-img'),busy;
  function pick(i){
    var s=T[i];tg.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i)});
    $('#vf-t').textContent=s.t;$('#vf-n').textContent=s.n;$('#vf-p').textContent=s.p;$('#vf-c').textContent=s.c;
    vf.classList.add('hunt');im.classList.add('blur');clearTimeout(busy);
    busy=setTimeout(function(){
      im.src='images/'+s.img+'.jpg';im.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+s.w+'w';im.width=s.w;im.height=s.h;im.alt=s.alt;
      var go=function(){vf.classList.remove('hunt');im.classList.remove('blur')};im.onload=go;setTimeout(go,700);
    },reduce?0:320);
  }
  tg.forEach(function(b,i){b.addEventListener('click',function(){pick(i)})});

  /* lightbox */
  var lb=$('#lb'),li=$('#lb-img'),lc=$('#lb-cap'),opener=null;
  $$('.ph-b').forEach(function(b){b.addEventListener('click',function(){
    opener=b;var f=b.dataset.full;li.src='images/'+f+'.jpg';li.srcset='images/'+f+'-720.jpg 720w, images/'+f+'.jpg '+b.dataset.w+'w';li.sizes='92vw';li.width=+b.dataset.w;li.height=+b.dataset.h;li.alt=b.dataset.alt;lc.textContent=b.dataset.cap;
    lb.hidden=false;document.body.style.overflow='hidden';$('#lb-x').focus();
  })});
  function closeLb(){lb.hidden=true;document.body.style.overflow='';if(opener)opener.focus()}
  $('#lb-x').addEventListener('click',closeLb);
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!lb.hidden)closeLb();else if(!sh.hidden){setM(false);bg.focus()}}});

  /* Malinta: scroll zoom + grid readout */
  var mal=$('#malinta');
  function zoom(){var r=mal.getBoundingClientRect(),k=Math.max(0,Math.min(1,1-(r.top+r.height)/(innerHeight+r.height)));mal.style.setProperty('--k',k.toFixed(3));mal.style.setProperty('--z',(1+k*.12).toFixed(3))}
  if(!reduce){addEventListener('scroll',zoom,{passive:true});zoom()}
  var cr=$('#cross'),cl=$('#cross-l');
  function aim(e){var r=mal.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    cr.style.setProperty('--cx',x+'px');cr.style.setProperty('--cy',y+'px');
    var col=Math.floor(x/160)+1,row=Math.floor(y/160)+1;cl.textContent='R '+(row<10?'0':'')+row+' · C '+(col<10?'0':'')+col;
    cl.style.transform=x>r.width-150?'translateX(-130%)':'none';cr.classList.add('show')}
  mal.addEventListener('pointermove',aim);mal.addEventListener('pointerdown',aim);
  mal.addEventListener('pointerleave',function(){cr.classList.remove('show')});

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
    note.textContent='Target acquired. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
