(function(){
  var d=document, root=d.documentElement;
  root.classList.remove('no-js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* before / after slider */
  var ba=d.querySelector('[data-ba]');
  if(ba){
    var range=ba.querySelector('.ba__range');
    var set=function(v){ba.style.setProperty('--p',v+'%');};
    range.addEventListener('input',function(){set(range.value);});
    if(!reduce){
      var t0=null, from=86, to=50;
      set(from);
      var step=function(ts){
        if(t0===null)t0=ts;
        var k=Math.min(1,(ts-t0)/1500), e=1-Math.pow(1-k,3);
        var v=from+(to-from)*e; set(v.toFixed(2)); range.value=Math.round(v);
        if(k<1)requestAnimationFrame(step);
      };
      setTimeout(function(){requestAnimationFrame(step);},500);
    }
  }
  requestAnimationFrame(function(){d.body.classList.add('is-ready');});

  /* repaint + reveal on scroll (one shot each) */
  var targets=d.querySelectorAll('.coat,.rv,.coat-card,.block__pair');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add(e.target.classList.contains('coat')?'is-painted':'in');
          io.unobserve(e.target);
        }
      });
    },{rootMargin:'0px 0px -12% 0px',threshold:0.06});
    targets.forEach(function(t){io.observe(t);});
  } else {
    targets.forEach(function(t){t.classList.add('in','is-painted');});
  }

  /* wet-paint progress line */
  var bar=d.querySelector('.wetline span'), tick=false;
  var upd=function(){
    var h=root.scrollHeight-window.innerHeight;
    bar.style.setProperty('--s',h>0?(window.scrollY/h).toFixed(4):0); tick=false;
  };
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
  upd();

  /* phone menu */
  var btn=d.querySelector('.burger'), sheet=d.getElementById('sheet');
  if(btn&&sheet){
    var close=function(){btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Open menu');sheet.hidden=true;d.body.style.overflow='';};
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      if(open){close();return;}
      btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-label','Close menu');sheet.hidden=false;d.body.style.overflow='hidden';
      var f=sheet.querySelector('a'); if(f)f.focus();
    });
    sheet.addEventListener('click',function(e){if(e.target.closest('a'))close();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheet.hidden){close();btn.focus();}});
    window.addEventListener('resize',function(){if(window.innerWidth>900&&!sheet.hidden)close();});
  }

  /* quote form: no backend yet */
  var form=d.getElementById('qform');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();});}
})();
