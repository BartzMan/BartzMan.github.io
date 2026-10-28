(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var NS='http://www.w3.org/2000/svg';
  function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}

  /* ridge progress + header */
  var bar=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;bar.classList.toggle('solid',y>40);bar.style.setProperty('--p',h>0?Math.min(1,y/h):0)}
  addEventListener('scroll',sc,{passive:true});sc();

  /* drawer */
  var mb=$('.menu'),dr=$('#drawer');
  function setM(o){mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');dr.hidden=!o;document.body.style.overflow=o?'hidden':''}
  mb.addEventListener('click',function(){setM(dr.hidden)});
  $$('a',dr).forEach(function(a){a.addEventListener('click',function(){setM(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dr.hidden){setM(false);mb.focus()}});

  /* reveal */
  var items=$$('.rise,.tile');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    items.forEach(function(n){io.observe(n)});
  }else items.forEach(function(n){n.classList.add('in')});

  /* mini protractor ticks (hero) */
  var pm=$('#pm-ticks');
  for(var a=0;a<=180;a+=15){var r=a*Math.PI/180,r1=a%45===0?70:78;pm.appendChild(el('line',{x1:100-r1*Math.cos(r),y1:100-r1*Math.sin(r),x2:100-86*Math.cos(r),y2:100-86*Math.sin(r)}))}

  /* flip tiles */
  $$('.tile').forEach(function(t){t.addEventListener('click',function(){t.setAttribute('aria-pressed',t.getAttribute('aria-pressed')!=='true')})});

  /* pitch protractor */
  var P=$('#proto'),arm=$('#p-arm'),knob=$('#p-knob'),pt=$('#proto-ticks'),poly=$('#roofpoly'),courses=$('#roofcourses');
  for(var d=0;d<=180;d+=10){var rr=d*Math.PI/180,q=d%30===0?20:12;pt.appendChild(el('line',{x1:200-160*Math.cos(rr),y1:210-160*Math.sin(rr),x2:200-(160-q)*Math.cos(rr),y2:210-(160-q)*Math.sin(rr)}))}
  var ZONES=[
    {max:4.6,name:'Low slope',cap:'Job photo · a wide plywood deck',on:'pp-low',text:'A shallow pitch with lots of flat deck to cover. Photo of fresh plywood laid across a roof.'},
    {max:8.6,name:'Everyday slope',cap:'Job photo · a house with an everyday slope',on:'pp-mid',text:'The classic pitch of a family house, where the courses of shingle sit in tidy rows.'},
    {max:99,name:'Steep slope',cap:'Job photo · gables on a white house',on:'pp-hi',text:'A steeper roof with gables stacked up high. Photo of a white house and its dark roof.'}
  ];
  var curZ='';
  function setPitch(p){
    p=Math.max(3,Math.min(12,p));
    var th=Math.atan(p/12),deg=th*180/Math.PI;
    var x=200-160*Math.cos(th),y=210-160*Math.sin(th);
    arm.setAttribute('x2',x);arm.setAttribute('y2',y);knob.setAttribute('cx',x);knob.setAttribute('cy',y);
    var rise=160*Math.tan(th),ay=132-rise;
    poly.setAttribute('points','40,132 200,'+ay+' 360,132');
    courses.innerHTML='';var n=7;
    for(var k=1;k<n;k++){var yy=132-k*rise/n,hw=160*(1-k/n);courses.appendChild(el('line',{x1:200-hw,y1:yy,x2:200+hw,y2:yy}))}
    var r2=Math.round(p*2)/2;$('#pn').textContent=(r2%1?r2.toFixed(1):r2);
    var z=ZONES.filter(function(z){return p<z.max})[0];
    P.setAttribute('aria-valuenow',r2);P.setAttribute('aria-valuetext',r2+' in 12, '+z.name.toLowerCase());
    if(z.name!==curZ){curZ=z.name;$('#pz').textContent=z.name;$('#pt').textContent=z.text;$('#pcap').textContent=z.cap;
      ['pp-low','pp-mid','pp-hi'].forEach(function(id){$('#'+id).classList.toggle('on',id===z.on)})}
    P._p=p;
  }
  function fromPtr(e){
    var r=P.getBoundingClientRect(),sx=400/r.width,cx=r.left+200/sx,cy=r.top+210/sx;
    var th=Math.atan2(cy-e.clientY,cx-e.clientX);if(!isFinite(th))return;
    th=Math.max(Math.atan(3/12),Math.min(Math.atan(12/12),th));
    setPitch(Math.tan(th)*12);
  }
  var pd=false;
  P.addEventListener('pointerdown',function(e){pd=true;P.setPointerCapture(e.pointerId);fromPtr(e);P.focus({preventScroll:true})});
  P.addEventListener('pointermove',function(e){if(pd)fromPtr(e)});
  P.addEventListener('pointerup',function(){pd=false});P.addEventListener('pointercancel',function(){pd=false});
  P.addEventListener('keydown',function(e){
    if(e.key==='ArrowUp'||e.key==='ArrowRight'){setPitch(P._p+.5);e.preventDefault()}
    if(e.key==='ArrowDown'||e.key==='ArrowLeft'){setPitch(P._p-.5);e.preventDefault()}
  });
  setPitch(6);

  /* before / after wipe */
  var wb=$('#wipe-box'),wr=$('.w-range',wb);
  wr.addEventListener('input',function(){wb.style.setProperty('--w',wr.value+'%')});

  /* crew strip: drag + buttons + progress */
  var st=$('#strip'),fill=$('#strip-fill');
  function prog(){var m=st.scrollWidth-st.clientWidth;fill.style.setProperty('--sx',(m>0?(st.scrollLeft/m)*300:0)+'%')}
  st.addEventListener('scroll',prog,{passive:true});prog();
  var down=false,sx0=0,sl0=0,moved=false;
  st.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx0=e.clientX;sl0=st.scrollLeft});
  addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx0;if(Math.abs(dx)>4){moved=true;st.classList.add('drag')}st.scrollLeft=sl0-dx});
  addEventListener('pointerup',function(){if(!down)return;down=false;st.classList.remove('drag')});
  $$('.ctl').forEach(function(b){b.addEventListener('click',function(){var w=$('.shot',st).getBoundingClientRect().width+30;st.scrollBy({left:w*(+b.dataset.dir),behavior:reduce?'auto':'smooth'})})});

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(4.6*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* quote form: preview only */
  var f=$('#qform'),note=$('#fnote');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',f).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Quote request noted. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
