(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var NS='http://www.w3.org/2000/svg';
  var root=document.documentElement;

  /* header + charge bar */
  var dh=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;dh.classList.toggle('solid',y>40);dh.style.setProperty('--p',h>0?Math.min(1,y/h):0)}
  addEventListener('scroll',sc,{passive:true});sc();

  /* sheet */
  var bg=$('.burg'),sh=$('#sheet');
  function setM(o){bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Close menu':'Open menu');sh.hidden=!o;document.body.style.overflow=o?'hidden':''}
  bg.addEventListener('click',function(){setM(sh.hidden)});
  $$('a',sh).forEach(function(a){a.addEventListener('click',function(){setM(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sh.hidden){setM(false);bg.focus()}});

  /* reveal */
  var rv=$$('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    rv.forEach(function(n){io.observe(n)});
  }else rv.forEach(function(n){n.classList.add('in')});

  /* lane parallax */
  var lanes=$$('.lane');
  function par(){lanes.forEach(function(l){var r=l.getBoundingClientRect(),m=r.top+r.height/2-innerHeight/2;l.style.setProperty('--t',Math.max(-1,Math.min(1,m/innerHeight)).toFixed(3))})}
  if(!reduce){addEventListener('scroll',par,{passive:true});par()}

  /* dynamo */
  var rotor=$('#rotor'),spin=$('#rspin'),meter=$('#meter'),segs=[];
  for(var i=0;i<20;i++){var s=document.createElement('i');meter.appendChild(s);segs.push(s)}
  var rt=$('#rticks');
  for(var a=0;a<360;a+=6){var r=a*Math.PI/180,r1=a%30===0?160:168;var ln=document.createElementNS(NS,'line');
    ln.setAttribute('x1',200+r1*Math.sin(r));ln.setAttribute('y1',200-r1*Math.cos(r));ln.setAttribute('x2',200+180*Math.sin(r));ln.setAttribute('y2',200-180*Math.cos(r));rt.appendChild(ln)}
  var base=40,pw=40,ang=0,last=null,drag=false,lastT=performance.now();
  var STATES=[[15,'Idle'],[35,'Warming up'],[55,'Humming'],[75,'Charged'],[92,'Surging'],[101,'Full power']];
  function paint(){
    var v=Math.max(0,Math.min(100,pw));root.style.setProperty('--pw',(v/100).toFixed(3));
    var n=Math.round(v);$('#pw-num').textContent=n;$('#pw-hero').textContent=n;
    var lit=Math.round(v/5);segs.forEach(function(sg,k){sg.className=k<lit?(k>=14?'on hi':'on'):''});
    var st=STATES.filter(function(x){return v<x[0]})[0][1];$('#pw-state').textContent=st;
    rotor.setAttribute('aria-valuenow',n);rotor.setAttribute('aria-valuetext',n+' percent power, '+st.toLowerCase());
    spin.style.transform='rotate('+ang+'deg)';
  }
  function pa(e){var r=rotor.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI}
  rotor.addEventListener('pointerdown',function(e){drag=true;rotor.setPointerCapture(e.pointerId);last=pa(e);rotor.focus({preventScroll:true})});
  rotor.addEventListener('pointermove',function(e){
    if(!drag)return;var c=pa(e),d=c-last;if(d>180)d-=360;if(d<-180)d+=360;last=c;ang+=d;pw=Math.max(0,Math.min(100,pw+Math.abs(d)/3.2));paint();
  });
  function up(){drag=false}rotor.addEventListener('pointerup',up);rotor.addEventListener('pointercancel',up);
  function setBase(d){base=Math.max(10,Math.min(100,base+d));pw=Math.max(pw,base);if(d<0)pw=base;ang+=d*3;paint()}
  rotor.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){setBase(5);e.preventDefault()}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){setBase(-5);e.preventDefault()}
  });
  $('#pw-more').addEventListener('click',function(){setBase(10)});
  $('#pw-less').addEventListener('click',function(){setBase(-10)});
  function tick(t){var dt=(t-lastT)/1000;lastT=t;if(!drag&&pw>base){pw=Math.max(base,pw-6*dt);ang+=pw*dt*2;paint()}requestAnimationFrame(tick)}
  paint();if(!reduce)requestAnimationFrame(tick);

  /* before/after */
  var wb=$('#wipe-box'),wr=$('.w-range',wb);
  wr.addEventListener('input',function(){wb.style.setProperty('--w',wr.value+'%')});

  /* photo tilt */
  if(!reduce&&matchMedia('(hover:hover)').matches){
    $$('.wp').forEach(function(w){var t=$('.tilt',w);
      w.addEventListener('pointermove',function(e){var r=w.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.setProperty('--ry',(x*10)+'deg');t.style.setProperty('--rx',(-y*10)+'deg')});
      w.addEventListener('pointerleave',function(){t.style.setProperty('--ry','0deg');t.style.setProperty('--rx','0deg')});
    });
  }

  /* rating count-up */
  var rn=$('#rn');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var dn=false,i2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!dn){dn=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(4.8*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6});i2.observe(rn);
  }

  /* form: preview only */
  var f=$('#qform'),note=$('#fnote');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',f).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Spark received. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
