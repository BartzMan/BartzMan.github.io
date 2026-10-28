(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* header solid + tape-measure progress */
  var top=$('#top'),tape=$('#tape-fill');
  function onScroll(){
    var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    top.classList.toggle('is-solid',y>40);
    top.style.setProperty('--p',h>0?Math.min(1,y/h):0);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* menu sheet */
  var burger=$('.burger'),sheet=$('#sheet');
  function setMenu(o){burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');sheet.hidden=!o;document.body.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setMenu(sheet.hidden)});
  $$('a',sheet).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheet.hidden){setMenu(false);burger.focus()}});

  /* reveal */
  var rv=$$('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){io.observe(el)});
  }else rv.forEach(function(el){el.classList.add('in')});

  /* pegboard: click a tool */
  var SVC=[
    {tool:'Adjustable wrench',title:'Heating',img:'unit-heater',w:1206,h:959,alt:'White unit heater hanging from a garage ceiling beside a steel shelf',text:'Heaters hung, set and tuned for Ohio winters, from a garage unit heater to the system that runs the whole house.',cap:'Job photo · unit heater hung overhead'},
    {tool:'Manifold gauge',title:'Cooling',img:'condenser-roof',w:1206,h:1034,alt:'Air conditioner condenser on a wood platform over a brown metal roof',text:'Outdoor condensers set where they need to sit: on the lawn, against the brick, even up on a roof platform.',cap:'Job photo · condenser on a roof platform'},
    {tool:'Screwdriver',title:'Wall units',img:'minisplit-wall',w:1206,h:1554,alt:'White wall-mounted air conditioner on a knotty pine wall',text:'Slim wall-mounted units for rooms that need their own comfort, mounted clean against the wall.',cap:'Job photo · wall unit on knotty pine'},
    {tool:'Pipe wrench',title:'Boilers',img:'boiler-room',w:1206,h:849,alt:'Two blue boilers with copper piping in a basement mechanical room',text:'Boilers and the pipework around them, down in the mechanical room where the heat starts.',cap:'Job photo · a pair of boilers in a basement'},
    {tool:'Torch',title:'Water heaters',img:'tank-heater',w:1206,h:1538,alt:'Tank water heater with ductwork beside it in a utility room',text:'Tank water heaters, vented and plumbed neatly, sitting next to the rest of the system.',cap:'Job photo · tank water heater'},
    {tool:'Tape measure',title:'Tankless',img:'tankless-copper',w:1206,h:1547,alt:'Tankless water heater on a plywood board with copper and black pipe',text:'Tankless water heaters mounted on a backer board with every pipe run measured and tidy.',cap:'Job photo · tankless on a plywood backer'}
  ];
  var tools=$$('.tool'),bi=$('#bench-img'),busy;
  function pick(i){
    var s=SVC[i];
    tools.forEach(function(t,k){var on=k===i;t.classList.toggle('is-on',on);t.setAttribute('aria-pressed',on)});
    $('#bench-tool').textContent=s.tool;$('#bench-title').textContent=s.title;$('#bench-text').textContent=s.text;$('#bench-cap').textContent=s.cap;$('#bench-no').textContent='0'+(i+1);
    bi.classList.add('swap');clearTimeout(busy);
    busy=setTimeout(function(){
      bi.src='images/'+s.img+'.jpg';bi.srcset='images/'+s.img+'-720.jpg 720w, images/'+s.img+'.jpg '+s.w+'w';bi.width=s.w;bi.height=s.h;bi.alt=s.alt;
      var done=function(){bi.classList.remove('swap')};bi.onload=done;setTimeout(done,500);
    },reduce?0:260);
  }
  tools.forEach(function(t,i){t.addEventListener('click',function(){pick(+t.dataset.svc)})});

  /* shop light */
  var lamp=$('.lamp'),ws=$('.wall-sec');
  lamp.addEventListener('click',function(){
    var off=lamp.getAttribute('aria-pressed')!=='true';
    lamp.setAttribute('aria-pressed',off);ws.classList.toggle('dim',off);
    lamp.setAttribute('aria-label',off?'Switch the shop light on':'Switch the shop light off');
    $('.lamp-t i',lamp).textContent=off?'Off · move to look around':'On · tap to switch off';
  });
  function spot(e){
    var r=ws.getBoundingClientRect(),p=e.touches?e.touches[0]:e;
    ws.style.setProperty('--mx',(p.clientX-r.left)+'px');ws.style.setProperty('--my',(p.clientY-r.top)+'px');
  }
  ws.addEventListener('pointermove',function(e){if(ws.classList.contains('dim'))spot(e)});
  ws.addEventListener('touchmove',function(e){if(ws.classList.contains('dim'))spot(e)},{passive:true});

  /* weather dial */
  var dial=$('#dial'),needle=$('#needle'),wx=$('#weather'),ang=0;
  var ticks=$('.ticks',dial),ns='http://www.w3.org/2000/svg';
  for(var a=-135;a<=135;a+=15){
    var ln=document.createElementNS(ns,'line'),r1=a%45===0?112:118,r2=128,rad=a*Math.PI/180;
    ln.setAttribute('x1',160+r1*Math.sin(rad));ln.setAttribute('y1',160-r1*Math.cos(rad));
    ln.setAttribute('x2',160+r2*Math.sin(rad));ln.setAttribute('y2',160-r2*Math.cos(rad));
    ticks.appendChild(ln);
  }
  var ZONES=[
    {max:.34,name:'Cold',text:'Cold off the lake. This is when the heaters, boilers and water heaters on the wall earn their keep.'},
    {max:.66,name:'Mild',text:'Water heaters work every day of the year. A mild week is a good week to look at the system.'},
    {max:1.01,name:'Hot',text:'Hot and heavy. This is the cooling side of the wall: condensers and wall units.'}
  ];
  var lastZ='';
  function setDial(k){
    k=Math.max(0,Math.min(1,k));ang=-135+270*k;
    dial.style.setProperty('--ang',ang+'deg');needle.style.transform='rotate('+ang+'deg)';
    wx.style.setProperty('--k',k);
    var z=ZONES.filter(function(z){return k<z.max})[0];
    dial.setAttribute('aria-valuenow',Math.round(k*100));dial.setAttribute('aria-valuetext',z.name);
    if(z.name!==lastZ){lastZ=z.name;$('#wx-zone').textContent=z.name;$('#wx-text').textContent=z.text}
  }
  function fromPointer(e){
    var r=dial.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    var d=Math.atan2(e.clientX-cx,-(e.clientY-cy))*180/Math.PI;
    if(d>135)d=135;if(d<-135)d=-135;
    setDial((d+135)/270);
  }
  var drag=false;
  dial.addEventListener('pointerdown',function(e){drag=true;dial.setPointerCapture(e.pointerId);fromPointer(e);dial.focus({preventScroll:true})});
  dial.addEventListener('pointermove',function(e){if(drag)fromPointer(e)});
  dial.addEventListener('pointerup',function(){drag=false});
  dial.addEventListener('pointercancel',function(){drag=false});
  dial.addEventListener('keydown',function(e){
    var k=(ang+135)/270,st=.06;
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){setDial(k+st);e.preventDefault()}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){setDial(k-st);e.preventDefault()}
    if(e.key==='Home'){setDial(0);e.preventDefault()}if(e.key==='End'){setDial(1);e.preventDefault()}
  });
  setDial(.5);

  /* rating count-up */
  var rn=$('#rate-n');
  if(rn&&'IntersectionObserver' in window&&!reduce){
    var done=false,io2=new IntersectionObserver(function(es){
      if(es[0].isIntersecting&&!done){done=true;var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);rn.textContent=(5*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(t0)}
    },{threshold:.6});io2.observe(rn);
  }

  /* quote form: preview only */
  var form=$('#quote'),note=$('#form-note');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('input[required]',form).filter(function(i){return !i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value))});
    if(bad.length){bad[0].focus();note.textContent='Please fill in your name, phone and email.';note.classList.remove('ok');return}
    note.textContent='Order stamped. This is a website preview, so the form is not connected yet. Call or text in the meantime.';
    note.classList.add('ok');
  });
})();

