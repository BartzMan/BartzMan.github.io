/* Marksmen Painting: spec-sheet tabs, the room paint estimate and the registration snap. The kit does menu, dock, lightbox, reveals and the form. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* services spec sheet: tabs with arrow-key support */
  var tabs = $$('.mk-tabs [role="tab"]');
  function select(t, focus) {
    tabs.forEach(function (b) {
      var on = b === t, p = document.getElementById(b.getAttribute('aria-controls'));
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle('is-on', on);
      if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  /* measure twice: a rough paint count for one room */
  var calc = document.querySelector('.mk-calc');
  if (calc) {
    var val = function (n) { return parseFloat(calc.querySelector('[name="' + n + '"]').value); };
    var out = function (n) { return calc.querySelector('[data-out="' + n + '"]'); };
    var half = function (g) { return Math.max(0.5, Math.ceil(g * 2) / 2); };
    var room = calc.querySelector('.mk-plan-room');
    var update = function () {
      var L = val('len'), W = val('wid'), H = val('hgt'), D = val('doors'), Wi = val('wins');
      var coats = parseFloat((calc.querySelector('[name="coats"]:checked') || { value: 2 }).value);
      var area = Math.max(0, 2 * (L + W) * H - D * 20 - Wi * 15);
      var walls = half(area * coats / 350), ceil = half(L * W * coats / 350);
      out('walls').textContent = String(walls);
      out('ceil').textContent = String(ceil);
      out('ceil').nextElementSibling.textContent = ceil === 1 ? 'gallon' : 'gallons';
      out('walls').nextElementSibling.textContent = walls === 1 ? 'gallon' : 'gallons';
      out('area').textContent = 'About ' + Math.round(area) + ' sq ft of wall, after the openings.';
      $$('output[data-for]', calc).forEach(function (o) {
        var n = o.getAttribute('data-for'), v = val(n);
        o.textContent = (n === 'doors' || n === 'wins') ? String(v) : v + ' ft';
      });
      if (room) {
        var s = Math.min(200 / L, 140 / W), w = L * s, h = W * s;
        room.setAttribute('x', 130 - w / 2); room.setAttribute('y', 100 - h / 2);
        room.setAttribute('width', w); room.setAttribute('height', h);
      }
    };
    calc.addEventListener('input', update);
    calc.addEventListener('change', update);
    update();
  }

  /* San Mateo comes into register as it scrolls into view */
  var reg = $$('[data-reg]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-reg'); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    reg.forEach(function (r) { io.observe(r); });
  } else reg.forEach(function (r) { r.classList.add('is-reg'); });
})();
