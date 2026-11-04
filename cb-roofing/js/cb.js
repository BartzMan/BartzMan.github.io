/* CB Roofing: concept interactions (patina plate tabs, layer drawing, ground-check rivets, gallery filters). Kit does the rest. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. service tabs: copper plates */
  var tabs = $$('.cu-plate[role="tab"]');
  function pick(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === 'Home') n = -i; if (e.key === 'End') n = tabs.length - 1 - i;
      if (n === undefined) return;
      e.preventDefault();
      pick(tabs[(i + n + tabs.length) % tabs.length], true);
    });
  });

  /* 2. roof layers: tap a layer, the drawing builds with scroll */
  var anat = document.getElementById('anatomy');
  var layerBtns = $$('#layer-list button');
  layerBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      layerBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (anat) anat.setAttribute('data-active', b.getAttribute('data-layer'));
    });
  });
  var sec = document.getElementById('layers');
  if (anat && sec && !still) {
    var tick = false, best = 0;
    anat.style.setProperty('--draw', '0');
    var draw = function () {
      tick = false;
      var r = sec.getBoundingClientRect(), vh = innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (vh * 0.75)));
      if (p <= best) return;
      best = p; /* draw once: the drawing never un-builds */
      anat.style.setProperty('--draw', p.toFixed(3));
    };
    draw();
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true });
    window.addEventListener('resize', draw);
  }

  /* 3. USEFUL: tap a rivet on the house to read that check */
  var tips = [
    ['Shingles', 'Look for missing, curled or cracked shingles, and bare patches where the granules have worn off.'],
    ['Gutters', 'Lots of shingle grit in the gutters or at the downspouts can mean the shingles are wearing thin.'],
    ['Flashing', 'Where the roof meets the chimney and walls, bent, lifted or rusty metal is a common way in for water.'],
    ['Vents & boots', 'Cracked vent covers or split rubber boots around pipes let rain in around the openings.'],
    ['Ceilings & attic', 'After heavy rain, check ceilings and the attic for stains, damp insulation or daylight.']
  ];
  var rivets = $$('.cu-rivet');
  var tipNo = document.getElementById('tip-no'), tipH = document.getElementById('tip-h'), tipP = document.getElementById('tip-p');
  var dots = $$('.cu-tip-dots li');
  rivets.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-tip');
      rivets.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      tipNo.textContent = 'Rivet ' + (i + 1) + ' of 5';
      tipH.textContent = tips[i][0];
      tipP.textContent = tips[i][1];
      dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    });
  });

  /* 4. gallery filters */
  var grid = document.querySelector('.cu-plates-grid');
  var fBtns = $$('.cu-filters button');
  fBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      fBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.cu-g', grid).forEach(function (g) { g.hidden = f !== 'all' && g.getAttribute('data-kind') !== f; });
      grid.classList.toggle('is-filtered', f !== 'all');
    });
  });
})();
