(function(){
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var NS='http://www.w3.org/2000/svg';

  /* header + stripe progress */
  var rh=$('#top');
  function sc(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;rh.classList.toggle('solid',y>40);rh.style.setProperty('--p',h>0?Math.min(1,y/h).toFixed(4):0)}
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

  /* hero drips */
  var COL=['#1f4bff','#ff4d4d','#ffc61a','#2ee6a6','#7a3cff'],g=$('#drips'),seed=7;
  function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
  for(var i=0;i<28;i++){
    var x=i*(1200/28)+rnd()*20,w=10+rnd()*14,hh=14+rnd()*58,c=COL[i%5];
    var r=document.createElementNS(NS,'rect');r.setAttribute('x',x);r.setAttribute('y',-2);r.setAttribute('width',w);r.setAttribute('height',hh);r.setAttribute('rx',w/2);r.setAttribute('fill',c);r.style.transformOrigin=x+'px 0px';
    if(!reduce)r.style.animation='drp '+(2.4+rnd()*2.6).toFixed(2)+'s ease-in-out '+(rnd()*2).toFixed(2)+'s infinite alternate';
    g.appendChild(r);
    var d=document.createElementNS(NS,'circle');d.setAttribute('cx',x+w/2);d.setAttribute('cy',hh);d.setAttribute('r',w*.62);d.setAttribute('fill',c);g.appendChild(d);
  }
  var st=document.createElement('style');st.textContent='@keyframes drp{from{transform:scaleY(.72)}to{transform:scaleY(1)}}';document.head.appendChild(st);

  /* panels: roller swap */
  $$('.panel').forEach(function(p){
    var b=$('.swap',p),cap=$('.pan-cap',p),t;
    b.addEventListener('click',function(){
      p.classList.add('moving');p.classList.toggle('flip');
      var f=p.classList.contains('flip');cap.textContent=f?cap.dataset.b:cap.dataset.a;
      clearTimeout(t);t=setTimeout(function(){p.classList.remove('moving')},reduce?0:750);
    });
  });

  /* paint the wall */
  var brick=$('#brick'),cells=[],COLS=10,ROWS=6,cur='#1f4bff',cnt=$('#cnt'),down=false,idx=0;
  for(var k=0;k<COLS*ROWS;k++){var c=document.createElement('div');c.className='cell';brick.appendChild(c);cells.push(c)}
  function count(){cnt.textContent=cells.filter(function(c){return c.classList.contains('on')}).length}
  function paint(i){
    var c=cells[i];if(!c)return;
    if(!cur){c.classList.remove('on');c.style.removeProperty('--k');count();return}
    c.style.setProperty('--k',cur);c.style.setProperty('--dx',(12+Math.floor(Math.random()*60))+'%');c.style.setProperty('--h',(16+Math.floor(Math.random()*34))+'px');
    c.classList.remove('on');void c.offsetWidth;c.classList.add('on');count();
  }
  function at(e){var r=brick.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;if(x<0||y<0||x>=1||y>=1)return -1;return Math.floor(y*ROWS)*COLS+Math.floor(x*COLS)}
  brick.addEventListener('pointerdown',function(e){down=true;var i=at(e);if(i>=0){idx=i;mark();paint(i)}});
  brick.addEventListener('pointermove',function(e){if(!down)return;var i=at(e);if(i>=0&&i!==idx){idx=i;mark();paint(i)}});
  addEventListener('pointerup',function(){down=false});addEventListener('pointercancel',function(){down=false});
  function mark(){cells.forEach(function(c,k){c.classList.toggle('cur',k===idx&&document.activeElement===brick)})}
  brick.addEventListener('focus',mark);brick.addEventListener('blur',function(){cells.forEach(function(c){c.classList.remove('cur')})});
  brick.addEventListener('keydown',function(e){
    var m=true;
    if(e.key==='ArrowRight')idx=Math.min(cells.length-1,idx+1);
    else if(e.key==='ArrowLeft')idx=Math.max(0,idx-1);
    else if(e.key==='ArrowDown')idx=Math.min(cells.length-1,idx+COLS);
    else if(e.key==='ArrowUp')idx=Math.max(0,idx-COLS);
    else if(e.key===' '||e.key==='Enter')paint(idx);
    else m=false;
    if(m){e.preventDefault();mark()}
  });
  $$('.sw').forEach(function(b){b.addEventListener('click',function(){
    cur=b.dataset.c;$$('.sw').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
  })});
  $('#clr').addEventListener('click',function(){cells.forEach(function(c){c.classList.remove('on')});count()});

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
    note.textContent='Splash received. This is a website preview, so the form is not connected yet. Call or text in the meantime.';note.classList.add('ok');
  });
})();
