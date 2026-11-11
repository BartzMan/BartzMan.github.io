(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* the sky shifts from dawn peach to clear morning blue as you scroll */
  var A=[246,201,168],B=[141,183,217];
  function mix(a,b,t){return a.map(function(v,i){return Math.round(v+(b[i]-v)*t)})}
  function rgb(c){return 'rgb('+c.join(',')+')'}
  function paint(t){
    var s=mix(A,B,t),w=mix(s,[255,255,255],.25);
    root.style.setProperty('--sky-a',rgb(s));
    root.style.setProperty('--tint',rgb(w));
  }
  function onScroll(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    paint(h>0?Math.min(1,Math.max(0,window.scrollY/h)):0);
  }
  if(reduce){paint(.35)}else{window.addEventListener('scroll',onScroll,{passive:true});onScroll()}

  /* tabs: Replace / Repair / Around solar */
  var tw=document.querySelector('[data-tabs]');
  if(tw){
    var tabs=[].slice.call(tw.querySelectorAll('.tab'));
    var panels=[].slice.call(tw.querySelectorAll('.panel'));
    var setTab=function(i,focus){
      tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i);t.classList.toggle('on',j===i);t.tabIndex=j===i?0:-1});
      panels.forEach(function(p,j){p.classList.toggle('on',j===i)});
      if(focus)tabs[i].focus();
    };
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){setTab(i)});
      t.addEventListener('keydown',function(e){
        if(e.key==='ArrowRight'){e.preventDefault();setTab((i+1)%tabs.length,true)}
        if(e.key==='ArrowLeft'){e.preventDefault();setTab((i+tabs.length-1)%tabs.length,true)}
      });
    });
  }

  /* drone hotspots */
  var sp=document.querySelector('[data-spots]');
  if(sp){
    var pick=function(k){
      sp.querySelectorAll('[data-spot]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-spot')===k)});
      sp.querySelectorAll('.spot-text').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-for')===k)});
    };
    sp.querySelectorAll('[data-spot]').forEach(function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-spot'))})});
  }

  /* solar sequence */
  var st=document.querySelector('[data-steps]');
  if(st){
    var cur=1,btns=[].slice.call(st.querySelectorAll('.step'));
    var scene=st.querySelector('.scene');
    var go=function(n,focus){
      cur=Math.max(1,Math.min(5,n));
      btns.forEach(function(b,i){var on=i+1===cur;b.classList.toggle('on',on);b.setAttribute('aria-current',on?'step':'false')});
      st.querySelectorAll('.step-text').forEach(function(t){t.classList.toggle('on',+t.getAttribute('data-for')===cur)});
      scene.setAttribute('data-step',cur);
      if(focus)btns[cur-1].focus();
    };
    btns.forEach(function(b,i){
      b.addEventListener('click',function(){go(i+1)});
      b.addEventListener('keydown',function(e){
        if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(cur+1,true)}
        if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(cur-1,true)}
      });
    });
    st.querySelector('[data-next]').addEventListener('click',function(){go(cur===5?1:cur+1)});
    st.querySelector('[data-prev]').addEventListener('click',function(){go(cur===1?5:cur-1)});
  }
})();
