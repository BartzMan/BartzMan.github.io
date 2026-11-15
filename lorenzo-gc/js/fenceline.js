/* Lorenzo's: fence line to front door. Gate tabs, roller wipe, stain slider, paint-weather boards. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  function tablist(list, after) {
    var tabs = $$('[role="tab"]', list);
    function pick(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
      if (focus) t.focus();
      if (after) after(t);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
    return pick;
  }

  /* inside / outside / fences gates, plus the walk pickets that open them */
  var gates = document.querySelector('.fd-gates');
  var pickGate = gates && tablist(gates);
  $$('.fd-walk a[data-tab]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = document.getElementById('fd-t-' + a.getAttribute('data-tab'));
      if (t && pickGate) pickGate(t);
    });
  });

  /* paint weather */
  var fc = document.querySelector('.fd-forecast');
  if (fc) tablist(fc);

  /* roller wipe */
  var wipe = document.querySelector('.fd-wipe'), range = document.getElementById('fd-wipe-range');
  if (wipe && range) {
    var set = function (v) { v = Math.max(0, Math.min(100, v)); range.value = v; wipe.style.setProperty('--x', v + '%'); };
    range.addEventListener('input', function () { set(+range.value); });
    var drag = false;
    var at = function (e) { var r = wipe.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    wipe.addEventListener('pointerdown', function (e) { drag = true; at(e); if (wipe.setPointerCapture) wipe.setPointerCapture(e.pointerId); });
    wipe.addEventListener('pointermove', function (e) { if (drag) at(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { wipe.addEventListener(ev, function () { drag = false; }); });
    set(50);
  }

  /* stain it */
  var STAINS = [
    { name: 'Raw cedar', color: '#D9A272',
      look: 'Bright orange-tan with every knot and grain line showing. In Houston sun and humidity it weathers toward silver-gray within months, and shady boards can mildew.',
      often: 'Nothing to redo, but nothing protects the wood either.' },
    { name: 'Clear sealer', color: '#CC8A50',
      look: 'Keeps the natural cedar color and grain, with a light sheen. It blocks little sun, so the wood still slowly goes gray.',
      often: 'Usually every 1 to 2 years.' },
    { name: 'Semi-transparent stain', color: '#985A2E',
      look: 'Adds color while the grain still shows through. The most common choice for cedar fences.',
      often: 'Roughly every 2 to 3 years.' },
    { name: 'Solid stain', color: '#5A3A27',
      look: 'Covers like paint and hides the grain and mismatched boards. It can peel if moisture gets behind it.',
      often: 'Roughly every 3 to 5 years, often with touch-ups in between.' }
  ];
  var sr = document.getElementById('fd-stain-range'), stage = document.querySelector('.fd-stain-stage');
  if (sr && stage) {
    var name = document.getElementById('fd-stain-name'), look = document.getElementById('fd-stain-look'), often = document.getElementById('fd-stain-often'),
        step = document.getElementById('fd-stain-step'), dot = document.querySelector('.fd-stain-dot');
    var show = function () {
      var i = +sr.value, s = STAINS[i];
      stage.setAttribute('data-stage', i);
      name.textContent = s.name; look.textContent = s.look; often.textContent = s.often;
      step.textContent = (i + 1) + ' of 4';
      sr.setAttribute('aria-valuetext', s.name);
      if (dot) dot.style.setProperty('--cur', s.color);
      $$('.fd-sample').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-v') === i)); });
    };
    sr.addEventListener('input', show);
    $$('.fd-sample').forEach(function (b) { b.addEventListener('click', function () { sr.value = b.getAttribute('data-v'); show(); }); });
    show();
  }
})();
