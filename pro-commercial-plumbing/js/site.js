/* Pro Commercial Services: SEWER CAM controller */
(function(){
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- phone menu sheet ---- */
  var sheet = doc.getElementById('sheet');
  var burger = doc.querySelector('[data-open-sheet]');
  var closer = doc.querySelector('[data-close-sheet]');
  function openSheet(){ if(!sheet) return; sheet.hidden = false; doc.body.style.overflow = 'hidden'; burger && burger.setAttribute('aria-expanded','true'); closer && closer.focus(); }
  function closeSheet(focusBack){ if(!sheet) return; sheet.hidden = true; doc.body.style.overflow = ''; if(burger){ burger.setAttribute('aria-expanded','false'); if(focusBack) burger.focus(); } }
  burger && burger.addEventListener('click', openSheet);
  closer && closer.addEventListener('click', function(){ closeSheet(true); });
  sheet && sheet.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ closeSheet(false); }); });
  doc.addEventListener('keydown', function(e){ if(e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(true); });

  /* ---- FAQ ---- */
  doc.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      var p = doc.getElementById(btn.getAttribute('aria-controls'));
      if(p) p.hidden = open;
    });
  });

  /* ---- FT counter + scroll progress (the signature) ---- */
  var LINE_FT = 186.4; /* the page, measured as a run of pipe */
  var ftEls = doc.querySelectorAll('[data-ft]');
  var bar = doc.querySelector('[data-progress]');
  var shown = 0, target = 0, raf = 0;
  function ratio(){ var max = Math.max(root.scrollHeight - window.innerHeight, 1); return Math.min(Math.max(window.pageYOffset / max, 0), 1); }
  function paint(){
    shown += (target - shown) * (reduce ? 1 : 0.18);
    if(Math.abs(target - shown) < 0.05) shown = target;
    var txt = ('000' + shown.toFixed(1)).slice(-5);
    for(var i = 0; i < ftEls.length; i++) ftEls[i].textContent = txt;
    if(bar) bar.style.transform = 'scaleX(' + (shown / LINE_FT) + ')';
    raf = shown !== target ? requestAnimationFrame(paint) : 0;
  }
  var dock = doc.querySelector('.dock');
  function onScroll(){ target = ratio() * LINE_FT; if(dock) dock.classList.toggle('on', window.pageYOffset > 420); if(!raf) raf = requestAnimationFrame(paint); }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- reveal on scroll (staggered via --d) ---- */
  var rv = doc.querySelectorAll('[data-rv]');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    rv.forEach(function(el){ io.observe(el); });
  } else {
    rv.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- never leave an empty bezel: promote lazy images once the page has loaded ---- */
  window.addEventListener('load', function(){
    setTimeout(function(){ doc.querySelectorAll('img[loading="lazy"]').forEach(function(img){ img.loading = 'eager'; }); }, 1200);
  });

  /* ---- phone gallery counter ---- */
  var car = doc.querySelector('[data-carousel]');
  var count = doc.querySelector('[data-count]');
  if(car && count){
    var feeds = car.children;
    car.addEventListener('scroll', function(){
      var mid = car.scrollLeft + car.clientWidth / 2, best = 0, bd = 1e9;
      for(var i = 0; i < feeds.length; i++){ var c = feeds[i].offsetLeft + feeds[i].offsetWidth / 2, dd = Math.abs(c - mid); if(dd < bd){ bd = dd; best = i; } }
      count.textContent = '0' + (best + 1) + ' / 0' + feeds.length;
    }, {passive:true});
  }

  /* ---- work order form: opens the visitor's own email app ---- */
  var form = doc.getElementById('wo-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var v = function(id){ var el = doc.getElementById(id); return el ? el.value.trim() : ''; };
      var err = form.querySelector('[data-err]');
      if(!v('f-name')){ if(err) err.hidden = false; doc.getElementById('f-name').focus(); return; }
      if(err) err.hidden = true;
      var lines = ['Name: ' + v('f-name')];
      if(v('f-phone')) lines.push('Phone: ' + v('f-phone'));
      if(v('f-zip')) lines.push('City / ZIP: ' + v('f-zip'));
      if(v('f-svc')) lines.push('About: ' + v('f-svc'));
      if(v('f-msg')) lines.push('', v('f-msg'));
      var subject = 'Request from ' + v('f-name') + (v('f-svc') ? ' (' + v('f-svc') + ')' : '');
      window.location.href = 'mailto:procommercialservicesllc@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
