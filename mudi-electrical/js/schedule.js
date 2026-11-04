/* Mudi Electrical: panel schedule interactions (schedule card -> job preview, breaker-trip steps) */
(function () {
  var C = {
    1: { src: 'job-chandelier', w: 1300, cap: 'Circuit 1 · chandeliers & pendants', note: 'gold chandelier, two-storey foyer', alt: 'A large gold chandelier of hanging metal leaves in a two-storey foyer' },
    2: { src: 'job-recessed', w: 960, cap: 'Circuit 2 · recessed lighting', note: 'cans in a row + a fan', alt: 'A living room ceiling with recessed can lights and a dark ceiling fan' },
    3: { src: 'job-fan', w: 1600, cap: 'Circuit 3 · ceiling fans', note: 'fan on a sloped ceiling', alt: 'A brushed-nickel ceiling fan on a sloped living room ceiling' },
    4: { src: 'job-kitchen', w: 1440, cap: 'Circuit 4 · kitchen lighting', note: 'cans + a brass sconce', alt: 'A white kitchen with recessed lights and a brass wall sconce' },
    5: { src: 'job-led', w: 1600, cap: 'Circuit 5 · fixtures & LED', note: 'LED petal fixture', alt: 'A modern LED ceiling fixture shaped like curved petals' },
    6: { ill: 'ill-6', cap: 'Circuit 6 · outlets & switches', note: 'drawing' },
    7: { ill: 'ill-7', cap: 'Circuit 7 · repairs & troubleshooting', note: 'drawing' },
    8: { src: 'job-kitchen-wiring', w: 1600, cap: 'Circuit 8 · remodel wiring', note: 'kitchen, lights going in', alt: 'A kitchen mid-remodel with new recessed lights and wires over the island' }
  };
  var img = document.getElementById('pv-img'), ill = document.getElementById('pv-ill');
  var cap = document.getElementById('pv-cap'), note = document.getElementById('pv-note');
  var btns = document.querySelectorAll('.ps-c');
  function show(n) {
    var c = C[n]; if (!c || !img) return;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === String(n) ? 'true' : 'false'); });
    if (c.src) {
      ill.hidden = true; img.hidden = false;
      img.srcset = 'images/' + c.src + '-720.jpg 720w, images/' + c.src + '.jpg ' + c.w + 'w';
      img.src = 'images/' + c.src + '.jpg'; img.alt = c.alt;
    } else {
      var srcEl = document.getElementById(c.ill);
      ill.innerHTML = ''; if (srcEl) { var s = srcEl.querySelector('svg').cloneNode(true); s.setAttribute('aria-hidden', 'true'); ill.appendChild(s); }
      ill.hidden = false; img.hidden = true;
    }
    cap.textContent = c.cap; note.textContent = c.src ? c.note + ' · Mudi photo' : 'drawing';
  }
  btns.forEach(function (b) { b.addEventListener('click', function () {
    show(+b.getAttribute('data-c'));
    var w = img && img.parentNode; if (w && w.getBoundingClientRect().top < 0) w.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }); });

  /* breaker-trip steps */
  var steps = document.querySelectorAll('.ps-step');
  var panel = document.querySelector('.ps-trip-panel');
  var cur = 1;
  function go(n) {
    cur = n;
    steps.forEach(function (s, i) {
      var on = i + 1 === n; s.setAttribute('aria-selected', on ? 'true' : 'false'); s.tabIndex = on ? 0 : -1;
      var p = document.getElementById(s.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
    if (panel) panel.setAttribute('data-step', n);
  }
  steps.forEach(function (s, i) {
    s.addEventListener('click', function () { go(i + 1); });
    s.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { var n = ((i + d + steps.length) % steps.length); go(n + 1); steps[n].focus(); }
    });
  });
  document.querySelectorAll('.ps-step-go').forEach(function (b) {
    b.addEventListener('click', function () { var n = cur + (+b.getAttribute('data-dir')); go(n < 1 ? 4 : n > 4 ? 1 : n); });
  });
})();
