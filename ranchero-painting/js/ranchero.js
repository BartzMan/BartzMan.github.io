/* Ranchero Painting: the branding-iron service tabs, the read-the-wall ledger, and the scroll-burned brand. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Irons: service tabs (mouse, touch, keyboard) */
  var tabs = $$('.ranch-iron');
  function pick(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-iron') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
      if (on && focus) t.focus();
      if (on && t.scrollIntoView && window.matchMedia('(max-width: 900px)').matches) {
        var list = t.parentElement; list.scrollTo({ left: t.offsetLeft - 4, behavior: 'smooth' });
      }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t.getAttribute('data-iron')); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (k === 'Home') n = 0;
      if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); pick(tabs[n].getAttribute('data-iron'), true); }
    });
  });
  $$('[data-goto-iron]').forEach(function (a) {
    a.addEventListener('click', function () { pick(a.getAttribute('data-goto-iron')); });
  });

  /* 2. Read the wall: ledger ticks light the pins on the drawing and route to an iron */
  var boxes = $$('.ranch-checks input');
  var count = document.querySelector('[data-count]');
  var verdict = document.querySelector('[data-verdict]');
  var link = document.querySelector('[data-verdict-link]');
  var names = { ext: 'Exterior walls & stucco', trim: 'Trim, fascia & accents', wood: 'Fences, gates & wood' };
  function update() {
    var on = boxes.filter(function (b) { return b.checked; });
    if (count) count.textContent = on.length;
    boxes.forEach(function (b) {
      var pin = document.querySelector('[data-pin="' + b.getAttribute('data-sign') + '"]');
      if (pin) pin.classList.toggle('is-on', b.checked);
    });
    if (!on.length) {
      verdict.textContent = 'Tick what you see. Snap a photo of each spot to send with your request.';
      link.hidden = true; return;
    }
    var tally = {};
    on.forEach(function (b) { var r = b.getAttribute('data-route'); tally[r] = (tally[r] || 0) + 1; });
    var top = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; })[0];
    verdict.textContent = 'Start with: ' + names[top] + '. Take a photo of each marked spot and send it with your request.';
    link.hidden = false;
    link.setAttribute('data-goto-iron', top);
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  if (link) link.addEventListener('click', function () { pick(link.getAttribute('data-goto-iron')); });
  $$('[data-pin]').forEach(function (pin) {
    pin.addEventListener('click', function () {
      var b = document.querySelector('.ranch-checks input[data-sign="' + pin.getAttribute('data-pin') + '"]');
      if (b) { b.checked = !b.checked; update(); }
    });
  });

  /* 3. The brand burns in as the Phoenix band scrolls through view */
  var band = document.querySelector('.ranch-range');
  var burn = document.querySelector('.ranch-burn-r');
  if (band && burn) {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tick = false;
    function draw() {
      tick = false;
      var r = band.getBoundingClientRect(), vh = window.innerHeight;
      var p = still ? 1 : Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      burn.style.setProperty('--draw', p.toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true });
    window.addEventListener('resize', draw);
    draw();
  }
})();
