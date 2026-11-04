/* Dave's Electrical Rebuilding: bench interactions (the kit does menu, bar, reveals, form). */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* FIG. 1: the exploded view. The slider takes the unit apart; part numbers explain each part. */
  var parts = $$('.xv .part'), range = $('.xv-range');
  var notes = {
    1: '01 Cover: closes the unit and keeps dust and moisture out. It comes off first, and cracks or warping show up here.',
    2: '02 Fasteners: the screws that hold it all together. Stripped or rusted ones get swapped so the unit closes up tight again.',
    3: '03 Terminals: where the wires connect. Loose or corroded connections run hot, so they are cleaned and tightened.',
    4: '04 Coil: windings that carry the current. Heat and age break down the insulation, which is a common reason a unit quits.',
    5: '05 Contacts: where current switches on and off. Every switch makes a tiny spark, so contacts pit and burn over time.',
    6: '06 Housing: the body that holds the parts in line. It is cleaned out and checked for cracks and wear.',
    7: '07 Base plate: mounts the unit in place. Bent plates or worn mounting holes let it shake loose.'
  };
  var svg = $('.xv'), small = false;
  var fit = function () {
    small = window.innerWidth < 700;
    if (svg) svg.setAttribute('viewBox', small ? '80 36 740 440' : '0 0 900 520');
  };
  fit(); window.addEventListener('resize', function () { fit(); if (range) setE(+range.value); });
  var setE = function (v) {
    var e = v / 100 * (small ? 0.68 : 1);
    parts.forEach(function (g) { g.setAttribute('transform', 'translate(' + (parseFloat(g.getAttribute('data-dx')) * e).toFixed(1) + ' 0)'); });
    if (range) { range.value = v; range.style.setProperty('--fill', v + '%'); }
  };
  if (range) {
    range.addEventListener('input', function () { setE(+range.value); });
    if (still) setE(80);
    else {
      setE(0);
      var t0 = null, go = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); var ease = 1 - Math.pow(1 - k, 3); setE(80 * ease); if (k < 1) requestAnimationFrame(go); };
      setTimeout(function () { requestAnimationFrame(go); }, 400);
    }
  }
  var pick = function (n) {
    parts.forEach(function (g) { g.classList.toggle('hot', g.getAttribute('data-part') === String(n)); });
    $$('.bom-b').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-part') === String(n)); b.setAttribute('aria-pressed', String(b.getAttribute('data-part') === String(n))); });
    $('.bom-note').textContent = notes[n];
    if (range && +range.value < 50) setE(80);
  };
  $$('.bom-b').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', function () { pick(+b.getAttribute('data-part')); }); });
  parts.forEach(function (g) { g.addEventListener('click', function () { pick(+g.getAttribute('data-part')); }); });

  /* SHEET 04: stations from teardown to tested */
  var steps = [
    ['Teardown', 'A rebuild starts by taking the unit apart, piece by piece, in an order that lets it go back together the same way.'],
    ['Clean & inspect', 'Dirt, dust and old grease come off, and each part is looked over for wear: burnt contacts, cracked housings, damaged insulation and loose connections.'],
    ['Replace worn parts', 'Whatever has worn out or failed is swapped for a sound part. Parts that are still good stay in.'],
    ['Reassemble', 'Everything goes back together, connections tightened and wiring routed where it belongs.'],
    ['Test', 'The rebuilt unit is checked before it goes back into service, so a fault shows up on the bench rather than on the job.']
  ];
  var st = $$('.station'), at = 0, wire = $('.wire');
  var show = function (i) {
    at = (i + steps.length) % steps.length;
    st.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === at)); b.tabIndex = k === at ? 0 : -1; });
    $$('.sp').forEach(function (s) { s.classList.toggle('sp-on', +s.getAttribute('data-sp') === at); });
    $('.step-n').textContent = '0' + (at + 1);
    $('.step-title').textContent = steps[at][0];
    $('.step-body').textContent = steps[at][1];
    wire.style.setProperty('--at', at);
    $('.step-next').textContent = at === steps.length - 1 ? 'Back to teardown →' : 'Next station →';
  };
  st.forEach(function (b, k) {
    b.addEventListener('click', function () { show(k); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(at + (e.key === 'ArrowRight' ? 1 : -1)); st[at].focus(); }
    });
  });
  if (st.length) {
    $('.step-next').addEventListener('click', function () { show(at + 1); });
    $('.step-prev').addEventListener('click', function () { show(at - 1); });
    show(0);
  }

  /* SHEET 05: the repair tag fills in */
  var boxes = $$('.checks-list input[type=checkbox]');
  var upd = function () {
    var n = 0;
    boxes.forEach(function (b) { var v = $('.rtag-v[data-v="' + b.getAttribute('data-c') + '"]'); if (v) v.classList.toggle('on', b.checked); if (b.checked) n++; });
    $('.rtag-foot').textContent = n === 4 ? 'All 4 noted: ready to call' : n + ' of 4 noted';
  };
  boxes.forEach(function (b) { b.addEventListener('change', upd); });

  /* WOOSTER: the dimension line draws in */
  var town = $('.town');
  if (town && 'IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { town.classList.add('on'); io.disconnect(); } }, { threshold: .3 });
    io.observe(town);
  } else if (town) town.classList.add('on');
})();
