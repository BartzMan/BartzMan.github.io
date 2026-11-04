/* Alamo Construction Services: concept interactions (arcade doorways, hero picker, storm-check keystone arch, gallery filters). Kit does the rest. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. the arcade: four doorways as tabs */
  var tabs = $$('.ar-door[role="tab"]');
  function pick(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus({ preventScroll: true });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      pick(tabs[(i + n + tabs.length) % tabs.length], true);
    });
  });

  /* 2. hero picker: "What needs work?" routes to the right doorway */
  $$('.ar-picker-row button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById('t-' + b.getAttribute('data-go'));
      if (!t) return;
      pick(t);
      var sec = document.getElementById('work');
      sec.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { t.focus({ preventScroll: true }); }, 600);
    });
  });

  /* 3. USEFUL: storm check; each tick sets one stone, the keystone goes in last */
  var checks = $$('.ar-checks button');
  var stones = $$('.ar-keyarch .vs');
  var count = document.getElementById('ka-n');
  function update() {
    var n = checks.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).length;
    stones.forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-i') <= n); });
    if (count) count.textContent = n;
  }
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
      update();
    });
  });

  /* 4. gallery filters */
  var gal = document.querySelector('.ar-gallery');
  var chips = $$('.ar-chips button');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      $$('.ar-g', gal).forEach(function (g) { g.hidden = f !== 'all' && g.getAttribute('data-k') !== f; });
      gal.classList.toggle('is-filtered', f !== 'all');
    });
  });
})();
