/* CP Contractor: spray reveals, service chips, the wash-prep-paint wall, the materials strip and the stucco check */
(function () {
  var root = document.documentElement;
  root.classList.add('cp-js');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* headings reveal like a spray pass */
  var sprays = $$('[data-spray]');
  if (still || !('IntersectionObserver' in window)) sprays.forEach(function (e) { e.classList.add('sprayed'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('sprayed'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    sprays.forEach(function (e) { io.observe(e); });
  }

  /* service chips (tabs) */
  var tabs = $$('.cp-tab');
  function openTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); openTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  $$('[data-need]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('.cp-need input[value="' + a.getAttribute('data-need') + '"]');
      if (r) r.checked = true;
    });
  });

  /* wash, prep, paint */
  var range = document.getElementById('wpp');
  if (range) {
    var washRect = document.getElementById('wash-rect'), paintRect = document.getElementById('paint-rect');
    var cracks = $$('.w-crack'), patches = $$('.w-patch'), mask = document.querySelector('.w-mask');
    var gun = document.getElementById('w-gun'), fan = document.querySelector('.w-gun-fan');
    var stateEl = document.getElementById('wall-state');
    var STEPS = [
      { n: 'Before', t: 'Dirty, chalky, cracked', img: 'own-garage-trim', w: 680, h: 1400, s: false,
        alt: 'A white wood garage door frame with paint flaking off down its length, next to brick',
        cap: 'Before prep: paint flaking off a garage door frame.',
        what: 'Years of sun, rain and humidity leave stucco grimy, mildewed at the bottom and cracked at the window corners. Paint over that and it won\u2019t last.',
        prev: 'Move the slider to wash the wall.' },
      { n: 'Pass 1 \u00b7 Wash', t: 'Lift the grime', img: 'stock-drops', w: 1600, h: 1060, s: true,
        alt: 'Water droplets on a blue glass surface', cap: 'Water does the first pass (illustrative stock photo).',
        what: 'Pressure washing takes off dirt, mildew and loose, chalky paint, then the wall is left to dry out before anything else happens.',
        prev: 'Paint sprayed over grime and mildew doesn\u2019t bond. It peels, and the mildew grows back through the new coat.' },
      { n: 'Pass 2 \u00b7 Prep', t: 'Fill, scrape, mask', img: 'stock-putty-knife', w: 1600, h: 1067, s: true,
        alt: 'A hand holding a wide putty knife loaded with white filler against a wall', cap: 'Filling and scraping (illustrative stock photo).',
        what: 'Cracks get filled, loose edges scraped, and windows, stone, lights and trim covered with tape, paper and plastic.',
        prev: 'Rain getting into hairline cracks, and overspray landing on glass, stone and fixtures.' },
      { n: 'Pass 3 \u00b7 Paint', t: 'The finish coat', img: 'stock-roller-4', w: 1600, h: 1200, s: true,
        alt: 'A hand rolling white paint onto a wall', cap: 'The finish coat (illustrative stock photo).',
        what: 'The coat goes on by sprayer, worked into the stucco texture so every pocket is covered. Then the tape and plastic come off.',
        prev: 'Thin, patchy coverage on rough stucco, and bare spots where water can soak in.' }
    ];
    var img = document.getElementById('step-img'), cap = document.getElementById('step-cap');
    var nEl = document.getElementById('step-n'), tEl = document.getElementById('step-t'), wEl = document.getElementById('step-what'), pEl = document.getElementById('step-prev');
    var stepBtns = $$('.cp-step');
    var cur = 0;
    var cl = function (x) { return Math.max(0, Math.min(1, x)); };
    function showStep(i) {
      if (i === cur) return;
      cur = i;
      var s = STEPS[i];
      img.classList.add('swap');
      setTimeout(function () {
        img.src = 'images/' + s.img + '.jpg';
        if (s.s) img.srcset = 'images/' + s.img + '-720.jpg 720w, images/' + s.img + '.jpg ' + s.w + 'w'; else img.removeAttribute('srcset');
        img.width = s.w; img.height = s.h; img.alt = s.alt;
        img.classList.remove('swap');
      }, 160);
      cap.textContent = s.cap; nEl.textContent = s.n; tEl.textContent = s.t; wEl.textContent = s.what; pEl.textContent = s.prev;
    }
    function render(v) {
      var p1 = cl(v / 33), p2 = cl((v - 33) / 33), p3 = cl((v - 66) / 34);
      washRect.setAttribute('x', String(900 * p1));
      paintRect.setAttribute('width', String(900 * p3));
      cracks.forEach(function (c) { c.style.opacity = String(1 - p2); });
      patches.forEach(function (c) { c.style.opacity = String(p2); });
      mask.style.opacity = p3 >= 1 ? '0' : String(p2);
      var x = null, col = null;
      if (p1 > 0 && p1 < 1) { x = 900 * p1; col = '#6FA3C8'; }
      else if (p3 > 0 && p3 < 1) { x = 900 * p3; col = '#F4E6CA'; }
      if (x === null) gun.style.opacity = '0';
      else { gun.style.opacity = '1'; gun.setAttribute('transform', 'translate(' + x + ' 470)'); fan.setAttribute('fill', col); }
      var label = v < 2 ? 'Before' : p1 < 1 ? 'Washing' : v <= 34 ? 'Washed' : p2 < 1 ? 'Prepping' : v <= 67 ? 'Prepped' : p3 < 1 ? 'Painting' : 'Painted';
      stateEl.textContent = label;
      range.setAttribute('aria-valuetext', label);
      var step = v < 10 ? 0 : v < 45 ? 1 : v < 80 ? 2 : 3;
      showStep(step);
      stepBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === step)); });
    }
    range.addEventListener('input', function () { render(+range.value); });
    var anim = null;
    stepBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var to = +b.getAttribute('data-to'), from = +range.value;
        if (anim) cancelAnimationFrame(anim);
        if (still || from === to) { range.value = to; render(to); return; }
        var t0 = null, dur = Math.min(1400, 18 * Math.abs(to - from) + 300);
        function step(ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min(1, (ts - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var v = Math.round(from + (to - from) * e);
          range.value = v; render(v);
          if (k < 1) anim = requestAnimationFrame(step);
        }
        anim = requestAnimationFrame(step);
      });
    });
    render(0);
  }

  /* materials strip arrows */
  var strip = document.querySelector('.cp-strip');
  $$('[data-strip]').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = strip.querySelector('.cp-mat');
      strip.scrollBy({ left: (+b.getAttribute('data-strip')) * (card ? card.offsetWidth + 24 : 320), behavior: still ? 'auto' : 'smooth' });
    });
  });

  /* stucco check */
  var V = {
    spots: ['wash', 'Wash', 'Green or black spots', 'That\u2019s mildew or algae on a shady, damp wall. A gentle wash with a mildew cleaner, low pressure on stucco, clears it. Paint over it and it comes back through.'],
    streaks: ['wash', 'Wash', 'Dark streaks under sills', 'Dirt that runs off sills and roof edges in the rain. It usually washes off; no paint needed yet.'],
    chalk: ['repaint', 'Repaint', 'Chalk on your hand', 'The paint is breaking down. Wash the chalk off first so the new coat bonds to the wall, not the dust.'],
    cracks: ['seal', 'Seal', 'Hairline cracks', 'Small cracks let rain into the wall. Fill them with a flexible stucco patch and seal before the next coat.'],
    peel: ['repaint', 'Repaint', 'Peeling or bubbling paint', 'Moisture is getting behind the paint. Find where the water comes from first, then scrape, prime and repaint.'],
    fade: ['repaint', 'Repaint, when you\u2019re ready', 'Faded on the sunny side', 'Fading is mostly looks. If the paint isn\u2019t chalky or cracked, it can wait until you want the color back.']
  };
  var verdict = document.getElementById('verdict');
  if (verdict) {
    var vt = document.getElementById('v-tag'), vh = document.getElementById('v-h'), vx = document.getElementById('v-t');
    $$('.cp-sym').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = V[b.getAttribute('data-sym')];
        $$('.cp-sym').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        verdict.setAttribute('data-v', d[0]); vt.textContent = d[1]; vh.textContent = d[2]; vx.textContent = d[3];
      });
    });
  }
})();
