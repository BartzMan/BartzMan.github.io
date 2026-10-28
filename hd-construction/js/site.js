(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var NS='http://www.w3.org/2000/svg';
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

  /* header, ruler marker */
  var bp=$('#top'),rm=$('#ruler-m'),hero=$('#hero');
  /* line-art generators: return path 'd' strings */
  function subway(W,H,rh,cw){var d='',y=0,row=0;for(y=rh;y<H;y+=rh)d+='M0 '+y+'H'+W;for(y=0,row=0;y<H;y+=rh,row++){for(var x=(row%2?cw/2:0);x<=W;x+=cw)d+='M'+x+' '+y+'V'+Math.min(H,y+rh)}return [d]}
  function hex(W,H,r){var d='',h=Math.sqrt(3)*r;for(var row=0;row*h*.5<H+h;row++){for(var col=0;col*1.5*r<W+r*2;col++){var cx=col*1.5*r,cy=row*h*.5*2-(col%2?0:h/2)+ (row?0:0);cy=row*h+(col%2?h/2:0);var p='';for(var k=0;k<6;k++){var a=Math.PI/3*k;p+=(k?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1)}d+=p+'Z'}}return [d]}
  function diamond(W,H,s){var d='';for(var x=-H;x<W+H;x+=s){d+='M'+x+' 0L'+(x+H)+' '+H+'M'+x+' '+H+'L'+(x+H)+' 0'}return [d]}
  function arts(kind,W,H){
    if(kind==='subway')return subway(W,H,40,90).concat(['M120 120h160v110H120zM140 140h120v70H140z']);
    if(kind==='hex')return hex(W,H,34);
    if(kind==='diamond')return diamond(W,H,90).concat(['M0 '+H/2+'H'+W]);
    if(kind==='slate')return subway(W,H,52,150);
    if(kind==='glossy')return subway(W,H,60,120).concat(['M0 90L'+W/2+' 20L'+W+' 90']);
    if(kind==='tub')return ['M70 330h460v70q0 40-40 40H110q-40 0-40-40z','M95 330q0-70 60-70h290q60 0 60 70','M190 70h220v130H190zM300 70v130M190 135h220','M0 70h190M410 70h190M0 200h190M410 200h190'].concat(subway(190,260,40,60).map(function(d){return d}));
    if(kind==='kitchen')return subway(W,300,45,100).concat(['M0 330h'+W+'M0 330v190M'+(W-0)+' 330v190','M40 360h220v140H40zM300 360h220v140H300z','M60 70h150v150H60zM110 70v150','M330 60h210M330 120h210M330 180h210','M440 330v-60q0-30 30-30h30']);
    if(kind==='plan')return ['M40 60h320v400H40z','M40 60h320','M240 60v110h120','M90 380a28 28 0 1 0 56 0a28 28 0 1 0-56 0','M70 90h70v70H70zM70 90l70 70M140 90l-70 70','M300 460a60 60 0 0 1 60-60','M40 250h90v60H40z'];
    return [];
  }
  function build(svg,kind){
    var vb=svg.getAttribute('viewBox').split(' ').map(Number),W=vb[2],H=vb[3];
    svg.innerHTML='';
    arts(kind,W,H).forEach(function(d){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('pathLength','1');svg.appendChild(p)});
  }

  /* plates: build art, paint on scroll */
  var plates=$$('.plate');
  plates.forEach(function(p){build($('.art',p),p.dataset.art)});
  if('IntersectionObserver' in window){
    var dio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$('.art',e.target).classList.add('drawn');dio.unobserve(e.target)}})},{threshold:.15});
    plates.forEach(function(p){dio.observe(p)});
  }else plates.forEach(function(p){$('.art',p).classList.add('drawn')});

  var hp0=0;
  function frame(){
    var y=scrollY,vh=innerHeight,h=document.documentElement.scrollHeight-vh;
    bp.classList.toggle('solid',y>40);
    rm.style.top='calc('+(h>0?clamp(y/h,0,1):0)*100+'% - '+((h>0?clamp(y/h,0,1):0)*4)+'px)';
    /* hero paint */
    var hv=reduce?1:clamp(.3+.7*(y/(vh*.7)),0,1);hero.style.setProperty('--hp',(hv*hp0).toFixed(3));
    /* plates */
    plates.forEach(function(p){
      var r=p.getBoundingClientRect(),v=reduce?1:clamp((vh*.88-r.top)/(r.height*.9),0,1);
      v=Math.max(v,p._v||0);p._v=v;
      p.style.setProperty('--pp',v.toFixed(3));p.classList.toggle('live',v>.02&&v<.98);
    });
  }
  addEventListener('scroll',frame,{passive:true});addEventListener('resize',frame);
  /* hero intro */
  var t0=performance.now();
  (function intro(t){var k=reduce?1:clamp((t-t0)/1500,0,1);hp0=1-Math.pow(1-k,3);frame();if(k<1)requestAnimationFrame(intro)})(t0);

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

  /* tile picker */
  var TP=[
    {n:'Subway',art:'subway',img:'shower-niche',w:1600,h:2133,alt:'Tiled walk-in shower with white subway tile, two niches with black hex tile and a hex tile floor',c:'Job photo · subway tile shower'},
    {n:'Hex',art:'hex',img:'hex-floor',w:1440,h:1440,alt:'Small bathroom with a black and white hex tile floor and white subway tile',c:'Job photo · hex tile bathroom floor'},
    {n:'Diamond',art:'diamond',img:'diamond-floor',w:1440,h:1440,alt:'Glossy black floor with a white diamond and line pattern',c:'Job photo · diamond pattern floor'},
    {n:'Slate plank',art:'slate',img:'tub-slate',w:1440,h:1440,alt:'White tub against dark slate plank tile with a marble band and a niche',c:'Job photo · slate plank tub wall'},
    {n:'Glossy blue',art:'glossy',img:'blue-shower',w:1600,h:2133,alt:'Tub and shower with glossy deep blue tile up to a sloped ceiling',c:'Job photo · glossy blue tub surround'}
  ];
  var tp=$('#tp'),tpimg=$('#tp-img'),tpart=$('#tp-art'),sw=$$('.swt'),anim=0;
  build(tpart,'subway');tpart.classList.add('drawn');
  function tween(from,to,ms,fn,done){var s=performance.now();(function st(t){var k=clamp((t-s)/ms,0,1),e=1-Math.pow(1-k,3);fn(from+(to-from)*e);if(k<1)anim=requestAnimationFrame(st);else if(done)done()})(s)}
  function choose(i){
    var s=TP[i];sw.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i)});
    cancelAnimationFrame(anim);tp.style.setProperty('--pp',0);tp.classList.add('live');
    tpart.classList.remove('drawn');build(tpart,s.art);void tpart.getBoundingClientRect();
    tpimg.src='images/'+s.img+'.jpg';tpimg.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+s.w+'w';tpimg.width=s.w;tpimg.height=s.h;tpimg.alt=s.alt;
    $('#tp-n').textContent=s.n;$('#tp-c').textContent=s.c;
    requestAnimationFrame(function(){tpart.classList.add('drawn')});
    if(reduce){tp.style.setProperty('--pp',1);tp.classList.remove('live');return}
    setTimeout(function(){tween(0,1,1400,function(v){tp.style.setProperty('--pp',v.toFixed(3))},function(){tp.classList.remove('live')})},500);
  }
  sw.forEach(function(b,i){b.addEventListener('click',function(){choose(i)})});

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var s0=performance.now();(function f(t){var p=Math.min(1,(t-s0)/1100);rn.textContent=(5*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(s0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Signed off. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
