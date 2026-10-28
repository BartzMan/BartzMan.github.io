(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

  /* header + vine */
  var hdr=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('solid',y>60);hdr.style.setProperty('--p',h>0?clamp(y/h,0,1).toFixed(4):0)}
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

  /* botanical pipe-plants (hand-built SVG) */
  var LEAVES=[[62,215,-1,.9],[104,183,1,.8],[62,150,-1,.7],[104,122,1,.62]];
  function bloom(kind){
    if(kind==='faucet')return '<path d="M100 70V44q0-26 26-26h22" fill="none" stroke="url(#cu)" stroke-width="12" stroke-linecap="round"/><rect x="142" y="14" width="18" height="12" rx="3" fill="#7a3813"/><path d="M151 30v14" stroke="#7fc3e8" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 5"/><rect x="82" y="56" width="36" height="8" rx="3" fill="#e59a5a"/><circle cx="82" cy="60" r="8" fill="#7a3813"/>';
    if(kind==='valve')return '<circle cx="100" cy="46" r="30" fill="none" stroke="#7a3813" stroke-width="7"/><path d="M100 16v60M70 46h60M79 25l42 42M121 25 79 67" stroke="#c9722f" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="46" r="7" fill="#e59a5a"/>';
    if(kind==='tank')return '<rect x="68" y="14" width="64" height="62" rx="22" fill="#e59a5a" stroke="#7a3813" stroke-width="5"/><path d="M100 30c10 10 12 18 6 26-5 7-17 5-18-4-1-7 8-12 12-22z" fill="#fff4d8" stroke="#c9722f" stroke-width="3"/><rect x="92" y="6" width="16" height="10" fill="#7a3813"/>';
    if(kind==='coil')return '<g fill="#e59a5a" stroke="#7a3813" stroke-width="4"><rect x="62" y="12" width="14" height="62" rx="6"/><rect x="82" y="12" width="14" height="62" rx="6"/><rect x="102" y="12" width="14" height="62" rx="6"/><rect x="122" y="12" width="14" height="62" rx="6"/></g><path d="M62 28h74M62 58h74" stroke="#7a3813" stroke-width="4"/>';
    return '<circle cx="100" cy="46" r="32" fill="#e59a5a" stroke="#7a3813" stroke-width="6"/><circle cx="100" cy="46" r="20" fill="none" stroke="#7a3813" stroke-width="3"/><path d="M100 26v40M80 46h40M86 32l28 28M114 32 86 60" stroke="#7a3813" stroke-width="3"/>';
  }
  function plant(kind,opts){
    opts=opts||{};
    var leaves=LEAVES.map(function(l,i){var s=l[3]*(opts.big?1.15:1);
      return '<g transform="translate(100 '+l[1]+') scale('+(l[2]*s).toFixed(2)+' '+s.toFixed(2)+') rotate(-24)"><use class="leaf" style="--k:'+i+'" href="#leaf" x="2" y="-15" width="60" height="30"/></g>'}).join('');
    return '<svg class="plant" viewBox="0 0 200 300" aria-hidden="true"><ellipse cx="100" cy="288" rx="78" ry="10" fill="#6b4a2c"/><circle cx="52" cy="286" r="5" fill="#8a6a45"/><circle cx="150" cy="287" r="4" fill="#8a6a45"/>'+
      '<g class="sway"><g class="stem"><rect x="94" y="70" width="12" height="212" fill="url(#cu)"/><rect x="89" y="228" width="22" height="10" rx="2" fill="#7a3813"/><rect x="89" y="168" width="22" height="10" rx="2" fill="#7a3813"/><rect x="89" y="108" width="22" height="10" rx="2" fill="#7a3813"/><path d="M99 76v204" stroke="rgba(255,255,255,.35)" stroke-width="2"/></g>'+leaves+'<g class="bloom">'+bloom(kind)+'</g></g></svg>';
  }
  $$('.spec-art').forEach(function(a){a.innerHTML='<span class="ghost">'+plant(a.dataset.kind).replace('class="plant"','class="plant grown"')+'</span>'+plant(a.dataset.kind)});
  var hp=$('#hero-plants');hp.innerHTML=plant('valve',{big:1})+plant('faucet',{big:1})+plant('coil',{big:1});
  var KINDS=['faucet','valve','tank','coil','drain'],gr=$('#g-row');
  for(var i=0;i<9;i++){var d=document.createElement('div');d.innerHTML=plant(KINDS[i%5],{big:1});var s=d.firstChild;s.style.height=(70+((i*37)%30))+'%';gr.appendChild(s)}
  $$('svg.plant',gr).forEach(function(s){s.style.height='clamp(180px,'+(24+Math.random()*12).toFixed(0)+'vw,520px)'});
  setTimeout(function(){$$('svg.plant',hp).forEach(function(s,k){setTimeout(function(){s.classList.add('grown')},k*350)})},reduce?0:400);

  /* water the specimens */
  var specs=$$('.spec'),msg=$('#bloom-msg');
  function tally(){var n=$$('.spec.on').length;msg.textContent=n===5?'Every specimen in bloom. The copper garden is open.':n+' of 5 specimens in bloom';msg.classList.toggle('full',n===5)}
  specs.forEach(function(sp){
    var b=$('.water',sp),pl=$('svg.plant',sp);
    b.addEventListener('click',function(){
      var on=!sp.classList.contains('on');sp.classList.toggle('on',on);pl.classList.toggle('grown',on);
      b.setAttribute('aria-pressed',on);$('span',b).textContent=on?'In bloom':'Water it';tally();
    });
  });
  if('IntersectionObserver' in window&&!reduce){
    var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var sp=$$('.spec')[0];if(!sp.classList.contains('on')){sp.classList.add('on');$('svg.plant',sp).classList.add('grown');$('.water',sp).setAttribute('aria-pressed','true');$('.water span',sp).textContent='In bloom';tally()}sio.disconnect()}})},{threshold:.5});
    sio.observe($('.spec-grid'));
  }

  /* garden grows with scroll */
  var gar=$('#garden'),gmax=0;
  function grow(){var r=gar.getBoundingClientRect(),g=reduce?1:clamp((innerHeight*.9-r.top)/(r.height*.8),0,1);gmax=Math.max(gmax,g);gr.style.setProperty('--g',gmax.toFixed(3))}
  addEventListener('scroll',grow,{passive:true});addEventListener('resize',grow);grow();

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(4.6*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var fm=$('#qform'),note=$('#fnote');
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',fm).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Request planted. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
