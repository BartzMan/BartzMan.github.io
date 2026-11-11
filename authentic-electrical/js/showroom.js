(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* ---- colour temperature: the whole page's light warms or cools ---- */
  var stops = [
    { k: 2700, name: 'Warm white', text: 'Candle-warm and amber. It suits living rooms, bedrooms and dining rooms, anywhere you want to slow down.' },
    { k: 3000, name: 'Soft white', text: 'Still warm, a touch cleaner. It suits kitchens, bathrooms and hallways that need to feel friendly and clear.' },
    { k: 3500, name: 'Neutral white', text: 'Crisp and even. It suits kitchens, home offices, laundry rooms and craft corners where you need to see detail.' },
    { k: 4000, name: 'Cool white', text: 'Bright and daylight-like. It suits garages, workshops and task areas; it can feel clinical in living rooms.' }
  ];
  var slider = $('#kslider'), reads = $$('[data-k-read]'), nameEl = $('[data-k-name]'), titleEl = $('[data-k-title]'), textEl = $('[data-k-text]');
  var btns = $$('.k-stops button');
  function mix(a, b, t) { return Math.round(a + (b - a) * t); }
  function setK(v) {
    v = Math.max(2700, Math.min(4000, +v));
    var t = (v - 2700) / 1300;
    var warm = [255, 200, 130], cool = [160, 196, 255];
    var c = 'rgb(' + mix(warm[0], cool[0], t) + ',' + mix(warm[1], cool[1], t) + ',' + mix(warm[2], cool[2], t) + ')';
    root.style.setProperty('--veil-c', c);
    var b = 'rgb(' + mix(255, 190, t) + ',' + mix(196, 218, t) + ',' + mix(120, 255, t) + ')';
    root.style.setProperty('--bulb', b);
    var near = stops.reduce(function (p, s) { return Math.abs(s.k - v) < Math.abs(p.k - v) ? s : p; });
    reads.forEach(function (r) { r.textContent = v + 'K'; });
    if (nameEl) nameEl.textContent = near.name;
    if (titleEl) titleEl.textContent = near.name;
    if (textEl) textEl.textContent = near.text;
    if (slider) { slider.value = v; slider.setAttribute('aria-valuetext', v + ' kelvin, ' + near.name.toLowerCase()); }
    btns.forEach(function (x) { x.setAttribute('aria-pressed', String(+x.getAttribute('data-k') === near.k && Math.abs(near.k - v) < 25)); });
  }
  if (slider) slider.addEventListener('input', function () { setK(slider.value); });
  btns.forEach(function (x) { x.addEventListener('click', function () { setK(x.getAttribute('data-k')); }); });
  setK(2700);

  /* ---- room by room tabs ---- */
  var tabs = $$('.room-tab');
  function showRoom(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showRoom(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = tabs[(i + tabs.length - 1) % tabs.length];
      if (n) { e.preventDefault(); showRoom(n, true); }
    });
  });
  $$('.try-k').forEach(function (b) {
    b.addEventListener('click', function () {
      setK(b.getAttribute('data-try'));
      var s = $('#light');
      if (s && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) s.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (s) s.scrollIntoView();
    });
  });

  /* ---- bulb guide stepper ---- */
  var steps = $$('.step'), dots = $$('.step-dots i'), count = $('.step-count'), at = 0;
  function go(n) {
    at = (n + steps.length) % steps.length;
    steps.forEach(function (s, i) { s.hidden = i !== at; });
    dots.forEach(function (d, i) { d.classList.toggle('on', i <= at); });
    if (count) count.textContent = 'Step ' + (at + 1) + ' of ' + steps.length;
  }
  $$('.step-btn').forEach(function (b) { b.addEventListener('click', function () { go(at + (+b.getAttribute('data-step'))); }); });
})();
