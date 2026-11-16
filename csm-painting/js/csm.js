(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. punch-list ticks: a section is "clear" once the viewer has scrolled past its start */
  var secs = $$('[data-punch]');
  var items = $$('[data-punch-for]');
  var boxes = $$('.pm-boxes i');
  var counts = $$('[data-punch-count]');
  function tick() {
    var line = window.innerHeight * 0.55, n = 0, now = -1;
    secs.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      var clear = r.bottom < line + 40 || (i === secs.length - 1 && (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 40);
      if (r.top < line && r.bottom >= line) now = i;
      var id = s.getAttribute('data-punch');
      var li = items.filter(function (x) { return x.getAttribute('data-punch-for') === id; })[0];
      if (li) { li.classList.toggle('is-clear', clear); li.classList.remove('is-now'); }
      if (boxes[i]) boxes[i].classList.toggle('on', clear);
      if (clear) n++;
    });
    if (now > -1) { var cur = items.filter(function (x) { return x.getAttribute('data-punch-for') === secs[now].getAttribute('data-punch'); })[0]; if (cur && !cur.classList.contains('is-clear')) cur.classList.add('is-now'); }
    counts.forEach(function (c) { c.textContent = n; });
  }
  var raf = 0;
  function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; tick(); }); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  tick();

  /* 2. commercial / residential switch */
  var audBtns = $$('.switch-btn');
  audBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-aud');
      audBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var c = $('#aud-commercial'), r = $('#aud-residential');
      c.hidden = a !== 'commercial'; r.hidden = a !== 'residential';
      onScroll();
    });
  });

  /* 3. walk the job */
  var plan = $('#plan');
  function walk(id) {
    $$('.wcard').forEach(function (c) { c.hidden = c.id !== 'wk-' + id; });
    $$('.pin').forEach(function (p) { var on = p.getAttribute('data-walk') === id; p.classList.toggle('is-on', on); p.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    $$('.chip').forEach(function (c) { c.setAttribute('aria-selected', c.getAttribute('data-walk') === id ? 'true' : 'false'); });
    if (plan) plan.setAttribute('data-on', id);
  }
  $$('[data-walk]').forEach(function (b) { b.addEventListener('click', function () { walk(b.getAttribute('data-walk')); }); });
  walk('canopy');

  /* 4. pre-job checklist */
  var rows = $$('.check-row');
  var out = $('#clipN'), stamp = $('#clipStamp');
  rows.forEach(function (r) {
    r.addEventListener('click', function () {
      r.setAttribute('aria-pressed', r.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var n = rows.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
      out.textContent = n;
      var done = n === rows.length;
      stamp.textContent = done ? 'Ready to paint' : '';
      stamp.classList.toggle('on', done);
    });
  });
})();
