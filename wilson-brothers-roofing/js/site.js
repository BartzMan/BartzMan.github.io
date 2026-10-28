(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
  var NS='http://www.w3.org/2000/svg';

  var hdr=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('solid',y>40);hdr.style.setProperty('--p',h>0?clamp(y/h,0,1).toFixed(4):0)}
  addEventListener('scroll',sc,{passive:true});sc();

  var bg=$('.burger'),sh=$('#sheet');
  function setM(o){bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Close menu':'Open menu');sh.hidden=!o;document.body.style.overflow=o?'hidden':''}
  bg.addEventListener('click',function(){setM(sh.hidden)});
  $$('a',sh).forEach(function(a){a.addEventListener('click',function(){setM(false)})});

  var rv=$$('.rise');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    rv.forEach(function(n){io.observe(n)});
  }else rv.forEach(function(n){n.classList.add('in')});

  /* bunting */
  var COL=['#c8372d','#f3ead8','#1c5a85','#f2b632','#2f86b9'];
  function bunting(svg){
    var r=svg.getBoundingClientRect(),w=Math.round(r.width)||1200,h=Math.round(r.height)||100;
    svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.setAttribute('preserveAspectRatio','none');svg.innerHTML='';
    var n=Math.max(8,Math.round(w/70)),sw=w/n,d='';
    function yAt(x){var t=x/w;return 8+(h-62)*(4*t*(1-t))*.6}
    for(var x=0;x<=w;x+=10)d+=(x?'L':'M')+x+' '+yAt(x).toFixed(1);
    var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke','#f3ead8');p.setAttribute('stroke-width','2');svg.appendChild(p);
    for(var k=0;k<n;k++){var cx=(k+.5)*sw,y=yAt(cx),f=document.createElementNS(NS,'path');
      f.setAttribute('class','pn');f.style.setProperty('--k',k);
      f.setAttribute('d','M'+(cx-sw*.38).toFixed(1)+' '+y.toFixed(1)+'L'+(cx+sw*.38).toFixed(1)+' '+y.toFixed(1)+'L'+cx.toFixed(1)+' '+(y+sw*.8).toFixed(1)+'Z');
      f.setAttribute('fill',COL[k%5]);f.setAttribute('stroke','rgba(11,36,56,.6)');f.setAttribute('stroke-width','1');svg.appendChild(f)}
  }
  var b1=$('#bunt'),b2=$('#bunt-f'),rt;
  function bb(){bunting(b1);bunting(b2)}bb();addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(bb,200)});

  /* flags */
  var F=[
    {t:'Roofing',img:'stock-shingles',w:1600,h:900,alt:'Close-up of weathered reddish-brown wooden roof shingles in overlapping rows',c:'Illustrative stock · weathered shingles',p:"The first flag on the line, and the name on the door. Shingles, flashing and the roof over your head. The photo here is illustrative stock, as the business's own photos show its remodeling work."},
    {t:'Bathrooms',img:'shower-niche',w:1600,h:2133,alt:'Tiled shower with a niche, a tile border, a towel warmer and a toilet',c:'Job photo · tiled shower with a niche',p:'Tiled showers with a niche and a border band, a towel warmer on the wall and a tile floor underfoot. A bathroom taken right down to the tile.'},
    {t:'Tubs & vanities',img:'tub-blue',w:1600,h:1200,alt:'Soaking tub with a tiled surround under a blue wall with a shelf TV and oak cabinets',c:'Job photo · soaking tub and oak cabinets',p:'A soaking tub set in a tiled surround, with oak cabinets and a double vanity beside it.'},
    {t:'Painting & trim',img:'sitting-bay',w:1600,h:1200,alt:'Two wing chairs in a sitting bay with three windows and blue walls',c:'Job photo · sitting bay in blue',p:'Lake-blue walls and wood trim, in a sitting bay and a bedroom with dark crown moulding.'},
    {t:'Floors',img:'hall-floor',w:1600,h:2133,alt:'Hallway with a pale plank floor, a mirrored closet door and wall lights',c:'Job photo · plank floor in a hallway',p:'A pale plank floor run the length of a hallway, past a mirrored closet and wall lights.'}
  ];
  var fl=$$('.flag'),im=$('#dk-img'),busy;
  function hoist(i){
    var s=F[i];fl.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i)});
    $('#dk-n').textContent='Flag '+(i+1);$('#dk-t').textContent=s.t;$('#dk-p').textContent=s.p;$('#dk-c').textContent=s.c;
    im.classList.add('sw');clearTimeout(busy);
    busy=setTimeout(function(){im.src='images/'+s.img+'.jpg';im.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+s.w+'w';im.width=s.w;im.height=s.h;im.alt=s.alt;var d=function(){im.classList.remove('sw')};im.onload=d;setTimeout(d,600)},reduce?0:280);
  }
  fl.forEach(function(b,i){b.addEventListener('click',function(){hoist(i)})});

  /* lightbox */
  var lb=$('#lb'),li=$('#lb-img'),lc=$('#lb-cap'),opener=null;
  $$('.gb').forEach(function(b){b.addEventListener('click',function(){
    opener=b;var f=b.dataset.full;li.src='images/'+f+'.jpg';li.srcset='images/'+f+'-720.jpg 720w, images/'+f+'.jpg '+b.dataset.w+'w';li.sizes='92vw';li.width=+b.dataset.w;li.height=+b.dataset.h;li.alt=b.dataset.alt;lc.textContent=b.dataset.cap;
    lb.hidden=false;document.body.style.overflow='hidden';$('#lb-x').focus();
  })});
  function closeLb(){lb.hidden=true;document.body.style.overflow='';if(opener)opener.focus()}
  $('#lb-x').addEventListener('click',closeLb);
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!lb.hidden)closeLb();else if(!sh.hidden){setM(false);bg.focus()}}});

  /* harbor lamp */
  var ver=$('#vermilion');
  function aim(e){var r=ver.getBoundingClientRect();ver.style.setProperty('--mx',(e.clientX-r.left)+'px');ver.style.setProperty('--my',(e.clientY-r.top)+'px')}
  ver.addEventListener('pointermove',aim);ver.addEventListener('pointerdown',aim);

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(4.7*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Signal sent. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
