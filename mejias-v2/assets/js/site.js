(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE = '+14809696719';

  /* ---- nav ---- */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  if (burger) burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  function closeSubs(except) {
    $$('.has-sub').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false');
    });
  }
  $$('.has-sub > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.parentNode, open = !li.classList.contains('open');
      closeSubs(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      e.stopPropagation();
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.has-sub')) closeSubs(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (nav) nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- reveal + count-up ---- */
  function countUp(el) {
    if (reduce) return;
    var end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suf || '', t0 = performance.now(), dur = 1500;
    (function f(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(function (c) {
          if (!seen.has(c)) { seen.add(c); countUp(c); }
        });
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* ---- hero sun parallax ---- */
  var sun = $('#sun'), tick = false;
  if (sun && !reduce) {
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { sun.style.transform = 'translateY(' + Math.min(window.scrollY * .12, 80) + 'px)'; tick = false; });
    }, { passive: true });
  }

  /* ---- lightbox ---- */
  var lb = $('#lb');
  if (lb) {
    var lbImg = $('#lb-img'), lbCap = $('#lb-cap'), shots = $$('[data-lb]'), cur = 0;
    var show = function (i) {
      cur = (i + shots.length) % shots.length; var s = shots[cur];
      lbImg.src = s.dataset.full; lbImg.alt = s.dataset.alt; lbCap.textContent = s.dataset.cap;
      if (!lb.open && lb.showModal) lb.showModal();
    };
    shots.forEach(function (s, i) { s.addEventListener('click', function () { show(i); }); });
    $('#lb-close').addEventListener('click', function () { lb.close(); });
    $('#lb-prev').addEventListener('click', function () { show(cur - 1); });
    $('#lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  }

  /* ---- estimate form: opens a text message (no email address on file) ---- */
  var form = $('#quote');
  if (form) {
    var toast = $('#toast');
    var pre = new URLSearchParams(location.search).get('s');
    if (pre) { var pc = $('input[data-slug="' + pre.replace(/[^a-z0-9-]/gi, '') + '"]', form); if (pc) pc.checked = true; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var needs = $$('input[name=need]:checked', form).map(function (i) { return i.value; });
      var d = { name: form.name.value.trim(), phone: form.phone.value.trim(), city: form.city.value, msg: form.msg.value.trim() }, bad = false;
      ['name', 'phone'].forEach(function (k) {
        var el = form[k], empty = !el.value.trim(); el.classList.toggle('field-err', empty); if (empty) bad = true;
      });
      toast.className = 'toast show' + (bad ? ' err' : '');
      if (bad) { toast.textContent = 'Please add your name and phone number so we can reach you.'; return; }
      toast.textContent = "Opening a text to Mejia's with your details. If nothing opens, just call or text (480) 969-6719.";
      var body = "Hi Mejia's! I'd like a free estimate.\nJob: " + (needs.join(', ') || 'a tree job') + '\nWhere: ' + d.city + '\nName: ' + d.name + '\nPhone: ' + d.phone + (d.msg ? '\nDetails: ' + d.msg : '');
      window.location.href = 'sms:' + PHONE + '?body=' + encodeURIComponent(body);
    });
  }

  /* ---- "trim, remove or leave it?" helper ---- */
  var helper = $('#helper');
  if (helper) {
    var logo = $('.logo'), rawRoot = (logo && logo.getAttribute('href')) || '', idx = /index\.html$/.test(rawRoot) ? 'index.html' : '', root = rawRoot.replace(/index\.html$/, '');
    var res = $('#h-result');
    var S = {
      palm: ['palm-tree-trimming', 'Palm trimming'], trim: ['tree-trimming-pruning', 'Tree trimming & pruning'],
      remove: ['tree-removal', 'Tree removal'], storm: ['storm-damage-cleanup', 'Storm damage cleanup']
    };
    var pick = function (tree, issue) {
      if (issue === 'storm') return ['storm', 'Storm damage is a safety job', "Keep well clear, especially of anything touching a power line, and don't climb or cut damaged wood yourself. Text us a photo and we'll tell you what's urgent and what can wait."];
      if (issue === 'gone') return ['remove', 'Sounds like a removal', 'If the tree has to go, we can take it down and haul it away, including large trees that need major equipment. Some removals in Mesa need a permit, so check what applies to yours.'];
      if (issue === 'roots') return ['remove', 'Needs an in-person look', 'Cracks, rot or lifting roots can mean a tree is unstable. It may still be saveable, but this is one to have looked at before the next storm. A photo is a good first step.'];
      if (tree === 'palm') return ['palm', 'Palm trimming', issue === 'dead' ? 'Dead and brown fronds are exactly what a palm trim removes. Seed pods can come off too, and healthy green fronds are best left alone.' : 'Overgrown fronds and a shaggy trunk are what palm trimming is for. Most palms need a cleanup once or twice a year.'];
      return ['trim', 'Tree trimming', issue === 'dead' ? 'Dead branches are normally removed by trimming. If most of the tree is dead, it may be past saving, and a photo will tell us which it is.' : "Thinning and shaping usually fixes an overgrown tree, and it's best done before monsoon season for dense canopies."];
    };
    var update = function () {
      var t = $('input[name=h-tree]:checked', helper), i = $('input[name=h-issue]:checked', helper);
      if (!t || !i) { res.hidden = true; return; }
      var r = pick(t.value, i.value), svc = S[r[0]];
      var big = t.value === 'big' ? '<div class="h-safe">Large and tall trees are a safety job. Leave them to a crew with the right equipment.</div>' : '';
      res.innerHTML = '<h3>' + r[1] + '</h3><p>' + r[2] + '</p>' + big +
        '<div class="h-acts"><a class="btn light sm" href="sms:' + PHONE + '?body=' + encodeURIComponent("Hi Mejia's! Here's a photo of my tree.") + '">Text a photo</a>' +
        '<a class="btn ghost-l sm" href="' + root + 'services/' + svc[0] + '/' + idx + '">About ' + svc[1].toLowerCase() + '</a></div>';
      res.hidden = false;
    };
    helper.addEventListener('change', update);
  }

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
