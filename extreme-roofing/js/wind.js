(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };

  /* wind streamlines in every [data-wind] */
  function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  $$('[data-wind]').forEach(function (el, k) {
    var n = parseInt(el.getAttribute('data-wind'), 10) || 6;
    var dark = el.getAttribute('data-tone') === 'dark';
    var p = '';
    for (var i = 0; i < n; i++) {
      var r1 = rnd(k * 31 + i), r2 = rnd(k * 17 + i * 3), r3 = rnd(k * 7 + i * 5);
      var y = 60 + (i + r1 * 0.7) * (720 / n);
      var a = 30 + r2 * 60, b = 30 + r3 * 60;
      var d = 'M-120 ' + y.toFixed(0) + ' C 200 ' + (y - a).toFixed(0) + ', 420 ' + (y + b).toFixed(0) + ', 700 ' + y.toFixed(0) +
              ' S 1100 ' + (y - b).toFixed(0) + ', 1560 ' + (y + a * .5).toFixed(0);
      if (i % 3 === 0) d = 'M-120 ' + y.toFixed(0) + ' C 300 ' + (y - 20).toFixed(0) + ', 520 ' + (y + 10).toFixed(0) + ', 640 ' + y.toFixed(0) +
        ' c 60 0 60 -50 10 -50 c -50 0 -40 60 40 50 C 1100 ' + (y - 10).toFixed(0) + ', 1300 ' + (y + 20).toFixed(0) + ', 1560 ' + y.toFixed(0);
      var col = dark ? (i % 4 === 0 ? 'rgba(168,64,10,.30)' : 'rgba(27,43,63,.20)') : (i % 4 === 0 ? 'rgba(242,107,29,.55)' : 'rgba(127,208,209,.38)');
      p += '<path d="' + d + '" stroke="' + col + '" stroke-width="' + (i % 3 === 0 ? 3 : 2) + '" vector-effect="non-scaling-stroke" style="--d:' + (8 + r1 * 7).toFixed(1) + 's;--dl:-' + (r2 * 9).toFixed(1) + 's"/>';
    }
    el.innerHTML = '<svg viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">' + p + '</svg>';
  });

  /* Beaufort scale label follows scroll */
  var names = ['Calm', 'Light air', 'Breeze', 'Strong breeze', 'Gale', 'Storm', 'Hurricane'];
  var bl = $('#beau-label'), bm = $('.beau-m');
  function beau() {
    var s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    var i = Math.min(names.length - 1, Math.floor(s * names.length));
    if (bl) { bl.textContent = names[i]; bl.classList.add('on'); bl.style.top = 'calc(' + (s * 100) + '% - 6px)'; }
  }
  window.addEventListener('scroll', beau, { passive: true }); beau();

  /* tabs */
  var tabs = $$('.tabs [role=tab]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t; o.setAttribute('aria-selected', on);
        var p = document.getElementById(o.getAttribute('aria-controls'));
        p.classList.toggle('on', on); p.hidden = !on;
      });
    });
  });

  /* uplift test */
  var L = window.WIND_LEVELS, rng = $('#wind-range'), out = $('#wind-out');
  if (rng && L) {
    var set = function (v) {
      v = Math.max(0, Math.min(4, +v)); rng.value = v;
      var d = L[v]; out.textContent = d.name;
      $('#r-name').textContent = d.name; $('#r-sub').textContent = d.sub; $('#r-first').textContent = d.first; $('#r-note').textContent = d.note;
      $('#r-checks').innerHTML = d.checks.map(function (c) { return '<li>' + c + '</li>'; }).join('');
      $$('#zones [data-z], .upar').forEach(function (e) { e.classList.toggle('hot', d.zones.indexOf(e.getAttribute('data-z')) > -1); });
      $$('#wind-steps button').forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-l') === v); });
      var f = $('#roofField'); if (f) f.classList.toggle('hot', v === 4);
      $$('.wl').forEach(function (w) { w.style.strokeWidth = 3 + v * 1.6; });
    };
    rng.addEventListener('input', function () { set(rng.value); });
    $$('#wind-steps button').forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-l')); }); });
    set(0);
  }

  /* after-storm checklist */
  var items = $$('#ck-list button'), gn = $('#g-name'), gb = $('#g-bar');
  var gl = ['Storm', 'Gale', 'Strong breeze', 'Breeze', 'Light air', 'Calm'];
  function gauge() {
    var n = items.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    if (gn) gn.textContent = gl[n]; if (gb) gb.style.setProperty('--pct', (n / items.length * 100) + '%');
    if (gb) gb.style.width = (n / items.length * 100) + '%';
  }
  items.forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); gauge(); });
  });
  gauge();

  /* gallery filter */
  var chips = $$('#chips button'), figs = $$('.mosaic figure');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c); });
      figs.forEach(function (g) { g.classList.toggle('hide', f !== 'all' && g.getAttribute('data-cat') !== f); });
    });
  });
})();
