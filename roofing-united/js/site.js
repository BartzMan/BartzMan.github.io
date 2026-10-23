/* Roofing United · Shingle Courses */
(function(){
  'use strict';
  var doc = document.documentElement;

  /* phone menu: full-screen sheet */
  var sheet = document.getElementById('sheet');
  var opener = document.querySelector('[data-open]');
  var closer = document.querySelector('[data-close]');
  function openSheet(){
    if(!sheet) return;
    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    if(opener) opener.setAttribute('aria-expanded','true');
    if(closer) closer.focus();
  }
  function closeSheet(returnFocus){
    if(!sheet || sheet.hidden) return;
    sheet.hidden = true;
    document.body.style.overflow = '';
    if(opener){ opener.setAttribute('aria-expanded','false'); if(returnFocus) opener.focus(); }
  }
  if(opener) opener.addEventListener('click', openSheet);
  if(closer) closer.addEventListener('click', function(){ closeSheet(true); });
  if(sheet) sheet.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ closeSheet(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeSheet(true); });

  /* progress meter (a row of tabs filling with orange) + course rail */
  var railN = document.querySelector('.rail-n');
  var railName = document.querySelector('.rail-name');
  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if('IntersectionObserver' in window){
    var courses = document.querySelectorAll('[data-course]');
    var railIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting && railN){
          railN.textContent = en.target.getAttribute('data-course');
          railName.textContent = en.target.getAttribute('data-name');
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    courses.forEach(function(c){ railIO.observe(c); });

    /* staggered reveals */
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    document.querySelectorAll('[data-reveal], .sa').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal], .sa').forEach(function(el){ el.classList.add('in'); });
  }

  /* the phone gallery scrolls sideways: load its photos as soon as it comes near, so no frame is ever empty */
  var steps = document.querySelector('.gal');
  if(steps && 'IntersectionObserver' in window){
    var gio = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ steps.querySelectorAll('img[loading="lazy"]').forEach(function(i){ i.loading = 'eager'; }); gio.disconnect(); }
    }, {rootMargin:'600px 0px'});
    gio.observe(steps);
  }

  /* request form: opens the visitor's own email app */
  var form = document.getElementById('quote-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var v = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = v('f-name'), phone = v('f-phone'), service = v('f-service'), area = v('f-area'), msg = v('f-msg');
      var lines = ['Hi Roofing United,', ''];
      if(msg) lines.push(msg, '');
      if(service) lines.push('Job: ' + service);
      if(area) lines.push('Neighborhood / ZIP: ' + area);
      if(name) lines.push('Name: ' + name);
      if(phone) lines.push('Phone: ' + phone);
      var subject = 'Roof request' + (name ? ' from ' + name : '') + (area ? ' (' + area + ')' : '');
      window.location.href = 'mailto:office@roofing-united.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
