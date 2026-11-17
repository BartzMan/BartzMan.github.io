(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* the fence line moves as you scroll: each section's split drifts between fence and canopy */
  var splits = $$('.split[data-split]');
  var bias = 0, biasTarget = 0, raf = 0;
  function sp(el, i, s) {
    var base = 50 + 20 * Math.sin(s * 9 + i * 1.4);
    if (el.id === 'services') base = 50 + bias + 6 * Math.sin(s * 9);
    if (el.id === 'top') base = 50 + 6 * Math.sin(s * 40);
    return Math.max(18, Math.min(82, base));
  }
  function paint() {
    raf = 0;
    var s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    if (Math.abs(biasTarget - bias) > 0.2) { bias += (biasTarget - bias) * 0.14; raf = requestAnimationFrame(paint); } else bias = biasTarget;
    splits.forEach(function (el, i) { el.style.setProperty('--sp', sp(el, i, s).toFixed(1)); });
  }
  function kick() { if (!raf && !reduce) raf = requestAnimationFrame(paint); }
  if (reduce) { splits.forEach(function (el, i) { el.style.setProperty('--sp', sp(el, i, 0).toFixed(1)); }); }
  else { window.addEventListener('scroll', kick, { passive: true }); paint(); }

  /* trees / fences tabs: the split in the services section swings to match */
  var tabs = $$('.tabs [role=tab]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t; o.setAttribute('aria-selected', on);
        var p = document.getElementById(o.getAttribute('aria-controls')); p.classList.toggle('on', on); p.hidden = !on;
      });
      biasTarget = t.id === 't-fences' ? 26 : -26;
      if (reduce) { bias = biasTarget; paint(); } else kick();
    });
  });
  biasTarget = -26; bias = -26;

  /* yard plan */
  var notes = $$('#plan-out .note'), empty = $('#plan-empty');
  function pick(k) {
    notes.forEach(function (n) { n.hidden = n.getAttribute('data-k') !== k; });
    $$('.hs').forEach(function (h) { h.classList.toggle('on', h.getAttribute('data-k') === k); });
    $$('#picks button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === k); });
  }
  $$('.hs').forEach(function (h) {
    h.addEventListener('click', function () { pick(h.getAttribute('data-k')); });
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(h.getAttribute('data-k')); } });
  });
  $$('#picks button').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-k')); }); });

  /* fence or tree checklist: each tick raises two pickets */
  var items = $$('#u-list button'), pk = $$('.build .pk'), msg = $('#build-msg');
  var words = ['Tick a check, add a picket', 'One check down', 'Halfway along the line', 'Nearly there', 'Ready to dig, in the right order'];
  function build() {
    var n = items.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    pk.forEach(function (p, i) { p.classList.toggle('up', i < n * 4); });
    if (msg) msg.textContent = words[n];
  }
  items.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); build(); }); });
  build();
})();
