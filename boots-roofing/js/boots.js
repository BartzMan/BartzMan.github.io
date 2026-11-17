(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* boot-print progress trail in the header */
  var trail=$('#trail');
  var PRINT='<svg viewBox="0 0 16 48"><path d="M0 8C0 2 4-2 8-2s8 4 8 10l-1 14c0 4-2 6-7 6s-7-2-7-6z"/><path d="M2 33h12v10c0 3-2 5-6 5s-6-2-6-5z"/></svg>';
  var prints=[];
  if(trail){
    var n=window.innerWidth<700?18:34,h='';
    for(var i=0;i<n;i++)h+=PRINT;
    trail.innerHTML=h;prints=$$('svg',trail);
    var tick=function(){
      var d=document.documentElement,max=d.scrollHeight-innerHeight,p=max>0?scrollY/max:0,on=Math.round(p*prints.length);
      prints.forEach(function(s,i){s.classList.toggle('on',i<on)});
    };
    addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);tick();
  }

  /* WALK THE ROOF */
  var plan=$('#plan');
  if(plan){
    var route=[[98,380],[250,225],[470,185],[312,312],[180,336],[330,360],[680,300]];
    var stopsAt=[1,2,3,4,6]; /* route indices of the 5 stops */
    var seg=[0],tot=0;
    for(var k=1;k<route.length;k++){tot+=Math.hypot(route[k][0]-route[k-1][0],route[k][1]-route[k-1][1]);seg.push(tot)}
    var NS='http://www.w3.org/2000/svg',g=$('#prints'),list=[],side=1,dist=18;
    while(dist<tot-8){
      var si=1;while(si<seg.length-1&&seg[si]<dist)si++;
      var a=route[si-1],b=route[si],t=(dist-seg[si-1])/(seg[si]-seg[si-1]);
      var x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,ang=Math.atan2(b[1]-a[1],b[0]-a[0]),px=-Math.sin(ang)*7*side,py=Math.cos(ang)*7*side;
      var el=document.createElementNS(NS,'g');
      el.setAttribute('transform','translate('+(x+px)+' '+(y+py)+') rotate('+(ang*180/Math.PI+90)+') scale(.5) translate(-8 -24)');
      el.setAttribute('class','print');
      el.innerHTML='<path d="M0 8C0 2 4-2 8-2s8 4 8 10l-1 14c0 4-2 6-7 6s-7-2-7-6z"/><path d="M2 33h12v10c0 3-2 5-6 5s-6-2-6-5z"/>';
      g.appendChild(el);list.push({el:el,d:dist});side=-side;dist+=30;
    }
    var btns=$$('#stopbtns button'),bodies=$$('.bt-stop-body'),st=$$('#stops .st');
    var go=function(i,noFocus){
      var reach=seg[stopsAt[i]];
      list.forEach(function(p,j){
        var on=p.d<=reach;
        if(reduce)p.el.setAttribute('class','print'+(on?' on':''));
        else setTimeout(function(){p.el.setAttribute('class','print'+(on?' on':''))},on?j*14:0);
      });
      btns.forEach(function(b,j){b.setAttribute('aria-pressed',j===i?'true':'false')});
      bodies.forEach(function(b,j){b.hidden=j!==i});
      st.forEach(function(s,j){s.classList.toggle('on',j===i)});
    };
    btns.forEach(function(b,i){b.addEventListener('click',function(){go(i)})});
    st.forEach(function(s,i){
      s.addEventListener('click',function(){go(i)});
      s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go(i)}});
    });
    go(0);
  }

  /* roof type tabs */
  var tabs=$$('.bt-tab'),panes=$$('.bt-svc-panel');
  var pick=function(i,focus){
    tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i?'true':'false');t.tabIndex=j===i?0:-1});
    panes.forEach(function(p,j){p.hidden=j!==i});
    if(focus)tabs[i].focus();
  };
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){
      var k=e.key,n=tabs.length;
      if(k==='ArrowRight'||k==='ArrowDown'){e.preventDefault();pick((i+1)%n,true)}
      else if(k==='ArrowLeft'||k==='ArrowUp'){e.preventDefault();pick((i-1+n)%n,true)}
    });
  });

  /* hail laces */
  var checks=$$('#laces .bt-check'),cnt=$('#lacecount'),done=$('#lacedone');
  var upd=function(){
    var c=checks.filter(function(b){return b.getAttribute('aria-pressed')==='true'}).length;
    cnt.textContent=c+' of 5 laced';done.hidden=c<5;
  };
  checks.forEach(function(b){
    b.addEventListener('click',function(){
      var on=b.getAttribute('aria-pressed')!=='true';
      b.setAttribute('aria-pressed',on?'true':'false');
      b.parentNode.classList.toggle('on',on);
      b.textContent=on?'✓':b.getAttribute('aria-label').replace(/\D/g,'');
      upd();
    });
  });
})();
