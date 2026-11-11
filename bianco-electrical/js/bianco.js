(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* the live wire: the red line grows down the page, each section's node switches on as it passes */
  var run = $('.run'), secs = $$('.node-sec');
  function wire() {
    if (!run) return;
    var r = run.getBoundingClientRect(), y = window.innerHeight * 0.62;
    var p = Math.max(0, Math.min(1, (y - r.top) / r.height));
    run.style.setProperty('--run', p.toFixed(4));
    secs.forEach(function (s) {
      var nodeY = parseFloat(getComputedStyle(s, '::before').top) || 70;
      s.classList.toggle('live', s.getBoundingClientRect().top + nodeY < y);
    });
  }
  window.addEventListener('scroll', wire, { passive: true });
  window.addEventListener('resize', wire);
  wire();

  /* breaker panel: flipping one on opens its service, the others flip off */
  var brks = $$('.brk');
  brks.forEach(function (b) {
    b.addEventListener('click', function () {
      brks.forEach(function (o) {
        var on = o === b;
        o.setAttribute('aria-pressed', String(on));
        var a = document.getElementById(o.getAttribute('aria-controls'));
        if (a) a.hidden = !on;
      });
    });
  });

  /* panel check: each tick loads the meter and changes the plain-English verdict */
  var boxes = $$('.chk input'), ticks = $$('.load i'), verdict = $('#verdict');
  var msg = [
    'Nothing ticked yet. Start with the label inside the panel door: it shows the panel’s size in amps.',
    'One sign on its own is common. Still worth asking for a load calculation before you add a charger or heat pump.',
    'A couple of signs. Ask an electrician for a load calculation first: it shows whether the panel has room.',
    'Several signs. Have the panel looked at before adding anything new to it.',
    'Many signs. Get the panel checked by an electrician before any new load goes on it.',
    'All five. Do not add a charger or heat pump until a professional has checked the panel.'
  ];
  function check() {
    var n = boxes.filter(function (c) { return c.checked; }).length;
    ticks.forEach(function (t, i) { t.classList.toggle('on', i < n * 2); });
    if (verdict) verdict.textContent = msg[n];
  }
  boxes.forEach(function (c) { c.addEventListener('change', check); });
})();
