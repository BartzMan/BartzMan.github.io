(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
  var NS='http://www.w3.org/2000/svg';

  /* header + water bar */
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

  /* bubbles */
  var bb=$('.bubbles'),seed=11;
  function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
  for(var i=0;i<16;i++){var b=document.createElement('i'),s=8+rnd()*26;
    b.style.cssText='left:'+(rnd()*100).toFixed(1)+'%;width:'+s.toFixed(0)+'px;height:'+s.toFixed(0)+'px;--t:'+(8+rnd()*8).toFixed(1)+'s;--dl:-'+(rnd()*12).toFixed(1)+'s;--dx:'+((rnd()-.5)*80).toFixed(0)+'px';
    bb.appendChild(b)}

  /* pearl necklaces */
  function necklace(svg,sag){
    var w=Math.round(svg.getBoundingClientRect().width)||1200,h=Math.round(svg.getBoundingClientRect().height)||120;
    svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.setAttribute('preserveAspectRatio','none');svg.innerHTML='';
    var r=Math.max(9,Math.min(15,w/60)),step=r*2.3,n=Math.floor(w/step),top=6,depth=h-r*2-8,d='M0 '+top;
    var pts=[];for(var k=0;k<=n;k++){var t=k/n,y=top+depth*(4*t*(1-t))*sag;pts.push([t*w,y])}
    pts.forEach(function(p,k){d+=(k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)});
    var th=document.createElementNS(NS,'path');th.setAttribute('d',d);th.setAttribute('fill','none');th.setAttribute('stroke','#c8773b');th.setAttribute('stroke-width','2');svg.appendChild(th);
    pts.forEach(function(p,k){
      var c=document.createElementNS(NS,'circle');c.setAttribute('class','pr');c.setAttribute('cx',p[0].toFixed(1));c.setAttribute('cy',(p[1]+r).toFixed(1));c.setAttribute('r',r.toFixed(1));c.setAttribute('fill','url(#pg)');c.setAttribute('stroke','rgba(15,34,56,.55)');c.setAttribute('stroke-width','1');c.style.setProperty('--k',k);svg.appendChild(c)});
  }
  var nk=$('#neck'),nf=$('#neck-f'),rt;
  function buildN(){necklace(nk,.55);necklace(nf,.55)}
  buildN();addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(buildN,200)});

  /* string accordion + pipe fill */
  var beads=$$('.bead');
  function openBead(li){
    beads.forEach(function(b){var on=b===li;b.classList.toggle('on',on);$('.pearl',b).setAttribute('aria-expanded',on)});
  }
  beads.forEach(function(li){$('.pearl',li).addEventListener('click',function(){openBead(li)})});
  var list=$('#string-list'),fmax=0;
  function fill(){var r=list.getBoundingClientRect(),f=reduce?1:clamp((innerHeight*.75-r.top)/r.height,0,1);fmax=Math.max(fmax,f);list.style.setProperty('--f',fmax.toFixed(3))}
  addEventListener('scroll',fill,{passive:true});addEventListener('resize',fill);fill();

  /* strand */
  var balls=$$('.ball');
  balls.forEach(function(bt){bt.addEventListener('click',function(){
    var on=!bt.classList.contains('big');
    balls.forEach(function(x){x.classList.remove('big');x.setAttribute('aria-pressed','false')});
    if(on){bt.classList.add('big');bt.setAttribute('aria-pressed','true')}
  })});

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
    note.textContent='Request strung. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
