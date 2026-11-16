(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- FIRE ESCAPE down the left edge (desktop) ---------- */
  var esc = $('#escape');
  function drawEscape() {
    if (!esc) return;
    esc.textContent = '';
    if (window.innerWidth < 1100) return;
    var main = $('#main'), H = main.offsetHeight, W = 112;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
    function el(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; }
    var g = el('g', { stroke: '#1B1B1D', fill: 'none', 'stroke-linecap': 'square' });
    var edge = el('g', { stroke: '#EDE4D3', fill: 'none', 'stroke-linecap': 'square', opacity: '.35' });
    var yLand = [];
    $$('main > section[data-floor]').forEach(function (s) { yLand.push(s.offsetTop + 78); });
    var x0 = 14, x1 = 92, step = 150, y = 40, dir = 0;
    var path = 'M' + x0 + ' ' + y;
    var pts = [[x0, y]];
    while (y < H - 60) {
      y += step; dir = 1 - dir;
      pts.push([dir ? x1 : x0, y]);
    }
    // zigzag flights
    var flights = '';
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      flights += 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1];
      // treads
      var n = 9;
      for (var t = 1; t < n; t++) {
        var px = a[0] + (b[0] - a[0]) * t / n, py = a[1] + (b[1] - a[1]) * t / n;
        flights += 'M' + (px - 5) + ' ' + py + 'L' + (px + 5) + ' ' + py;
      }
    }
    g.appendChild(el('path', { d: flights, 'stroke-width': 3 }));
    // landings (platform + railing) at each turn
    var land = '';
    pts.forEach(function (p) {
      land += 'M' + (p[0] - 14) + ' ' + p[1] + 'L' + (p[0] + 14) + ' ' + p[1];
    });
    g.appendChild(el('path', { d: land, 'stroke-width': 7 }));
    // big floor landings with rails at section lines
    var rails = '';
    yLand.forEach(function (ly) {
      rails += 'M6 ' + ly + 'H106M6 ' + (ly - 34) + 'H106M6 ' + (ly - 34) + 'V' + ly + 'M106 ' + (ly - 34) + 'V' + ly;
      for (var k = 22; k < 106; k += 16) rails += 'M' + k + ' ' + (ly - 34) + 'V' + ly;
    });
    var plat = '';
    yLand.forEach(function (ly) { plat += 'M0 ' + ly + 'H112'; });
    g.appendChild(el('path', { d: plat, 'stroke-width': 8 }));
    g.appendChild(el('path', { d: rails, 'stroke-width': 2.5 }));
    edge.appendChild(el('path', { d: plat, 'stroke-width': 1.5, transform: 'translate(0 -4)' }));
    svg.appendChild(edge); svg.appendChild(g);
    esc.appendChild(svg);
  }
  window.addEventListener('load', drawEscape);
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(drawEscape, 200); });
  setTimeout(drawEscape, 600); setTimeout(drawEscape, 2000);

  /* ---------- floors light up with scroll ---------- */
  var fl = $$('.floors i');
  function lightFloors() {
    var p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    var n = Math.min(fl.length, Math.round(p * (fl.length + 0.4)) + (p > 0.02 ? 1 : 0));
    fl.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
  }
  window.addEventListener('scroll', lightFloors, { passive: true }); lightFloors();

  /* ---------- THE WALK-UP ---------- */
  var ICON = {
    outlet: '<svg viewBox="0 0 120 90"><rect x="30" y="8" width="60" height="74" rx="8" fill="#EDE4D3"/><rect x="48" y="26" width="6" height="18" fill="#1B1B1D"/><rect x="66" y="26" width="6" height="18" fill="#1B1B1D"/><path d="M52 62q8 8 16 0" stroke="#1B1B1D" stroke-width="3" fill="none"/></svg>',
    breaker: '<svg viewBox="0 0 120 90"><rect x="14" y="6" width="92" height="78" rx="4" fill="#4F5B66" stroke="#EDE4D3" stroke-width="3"/><g fill="#EDE4D3"><rect x="26" y="16" width="14" height="24"/><rect x="52" y="16" width="14" height="24"/><rect x="78" y="16" width="14" height="24"/></g><g fill="#F5C66A"><rect x="26" y="48" width="14" height="24"/><rect x="52" y="48" width="14" height="24"/></g></svg>',
    bulb: '<svg viewBox="0 0 120 90"><circle cx="60" cy="38" r="22" fill="#F5C66A"/><rect x="50" y="58" width="20" height="14" fill="#EDE4D3"/><path d="M60 4v8M22 20l6 5M98 20l-6 5M16 44h8M96 44h8" stroke="#F5C66A" stroke-width="3" stroke-linecap="round"/></svg>',
    cord: '<svg viewBox="0 0 120 90"><rect x="8" y="30" width="30" height="40" rx="4" fill="#EDE4D3"/><path d="M38 50q30 -30 44 4t24 -10" stroke="#F5C66A" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="88" y="34" width="24" height="26" rx="3" fill="#EDE4D3"/></svg>',
    switch: '<svg viewBox="0 0 120 90"><rect x="34" y="6" width="52" height="78" rx="6" fill="#EDE4D3"/><rect x="46" y="20" width="28" height="50" rx="4" fill="#1B1B1D"/><rect x="48" y="22" width="24" height="22" rx="3" fill="#F5C66A"/><path d="M96 22q6 6 0 12M104 18q10 10 0 20" stroke="#F5C66A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    plug: '<svg viewBox="0 0 120 90"><rect x="30" y="8" width="60" height="74" rx="8" fill="#EDE4D3"/><circle cx="60" cy="34" r="9" fill="#1B1B1D"/><path d="M40 14q10 8 0 18M80 56q10 8 0 18" stroke="#F5C66A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
  };
  var ROOMS = {
    kitchen: { n: 1, name: 'Kitchen', trouble: 'Trips when two things run at once.', icon: 'breaker', svc: 'Electrical repairs', go: 0,
      text: 'In an older kitchen, the toaster, the kettle and the microwave can end up sharing one circuit, so it trips when they run together.' },
    bath: { n: 2, name: 'Bathroom', trouble: 'One old outlet, right by the sink.', icon: 'plug', svc: 'Outlets and switches', go: 2,
      text: 'Older bathrooms often have a single outlet near the basin, sometimes loose or discoloured. Water and tired outlets are a poor mix, so it is worth having it looked at.' },
    bed: { n: 3, name: 'Bedroom', trouble: 'Extension cords everywhere.', icon: 'cord', svc: 'Outlets and switches', go: 2,
      text: 'Older bedrooms may have too few outlets, some of them old two-prong ones, with a chain of extension cords to reach the bed.' },
    living: { n: 4, name: 'Living room', trouble: 'A fixture that dims or flickers.', icon: 'bulb', svc: 'Lighting and fixtures', go: 1,
      text: 'A ceiling light that flickers, buzzes or runs dim can point to a tired fixture, a loose connection or an old switch.' },
    hall: { n: 5, name: 'Hallway', trouble: 'A switch that feels warm.', icon: 'switch', svc: 'Electrical repairs', go: 0,
      text: 'A hallway light that flickers, or a switch that feels warm or crackles, is not one to ignore. Turn it off and have it looked at.' },
    panel: { n: 6, name: 'Basement panel', trouble: 'An old panel that trips or smells hot.', icon: 'breaker', svc: 'Panels and wiring updates', go: 3,
      text: 'Old panels are crowded, hand-labelled and trip often. If you smell something hot or see scorch marks, keep away, do not open the cover, and call a professional.' }
  };
  var rooms = $$('#facade .room'), cur = 'kitchen';
  function showRoom(k) {
    var r = ROOMS[k]; if (!r) return; cur = k;
    rooms.forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-room') === k); });
    $$('.rchip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-room') === k)); });
    $('#room-no').textContent = 'Window ' + r.n + ' of 6';
    $('#room-name').textContent = r.name;
    $('#room-trouble').textContent = r.trouble;
    $('#room-text').textContent = r.text;
    $('#room-art').innerHTML = ICON[r.icon];
    var a = $('#room-svc'); a.textContent = r.svc;
  }
  rooms.forEach(function (g) {
    var k = g.getAttribute('data-room');
    g.addEventListener('click', function () { showRoom(k); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showRoom(k); } });
  });
  $$('.rchip').forEach(function (c) { c.addEventListener('click', function () { showRoom(c.getAttribute('data-room')); }); });
  showRoom('kitchen');
  // decorative windows light up floor by floor when the facade scrolls in
  var dws = $$('#facade .dw');
  function lightFacade() {
    dws.slice().sort(function (a, b) { return +b.getAttribute('data-f') - +a.getAttribute('data-f'); }).forEach(function (g, i) {
      setTimeout(function () { g.classList.add('lit'); }, still ? 0 : 280 * i);
    });
  }
  var fac = $('#facade');
  if (fac && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { lightFacade(); io.disconnect(); } }, { threshold: .25 });
    io.observe(fac);
  } else lightFacade();

  /* ---------- SERVICES: Apartment / Storefront ---------- */
  var SETS = {
    apt: [
      { img: 'stock-junction-box', w: 1400, h: 1050, alt: 'An open grey junction box with several wires joined inside a wall',
        what: 'Fixing what has stopped working: a dead outlet, a circuit that keeps tripping, a light with no power.', when: 'When something that worked yesterday does not work today.', h: 'Electrical repairs' },
      { img: 'stock-chandelier', w: 1000, h: 1250, alt: 'A small brass chandelier with white glass shades glowing against a warm ceiling',
        what: 'New or replacement ceiling lights, wall lights and fixtures, hung and wired.', when: 'When a room is too dim, a fixture flickers, or you want something better on the ceiling.', h: 'Lighting and fixtures' },
      { img: 'stock-socket-repair', w: 1000, h: 1498, alt: 'Hands fitting a wall socket with a screwdriver, wires showing',
        what: 'Replacing worn, loose or old-style outlets and switches, and adding outlets where you need them.', when: 'When a plug will not stay in, a switch is warm, or you are running extension cords across a room.', h: 'Outlets and switches' },
      { img: 'stock-breaker-panel', w: 1000, h: 1000, alt: 'Close view of breakers and labelled wiring terminals inside an electrical panel',
        what: 'Updating an old panel or tired wiring so the circuits are laid out clearly.', when: 'When the panel is crowded, hand-labelled or trips often, or the wiring behind the walls is original.', h: 'Panels and wiring updates' }
    ],
    shop: [
      { img: 'stock-multimeter', w: 1200, h: 1200, alt: 'Hands holding test probes against wiring terminals',
        what: 'For a shop: a dead counter outlet, a sign that will not light, a circuit that trips when the doors open.', when: 'When trading stops because something electrical has.', h: 'Electrical repairs' },
      { img: 'stock-storefront', w: 1600, h: 1172, alt: 'A brick corner building with a blue-framed ground-floor shop window',
        what: 'Ceiling, track and display lighting, so the shop reads well from the sidewalk.', when: 'When the shop looks dull at night, or the window needs to show off what is inside.', h: 'Lighting and fixtures' },
      { img: 'stock-meter', w: 1400, h: 1400, alt: 'A clamp meter, pliers and coloured wires laid on a stone floor',
        what: 'Outlets and switches where the till, the card reader and the fridge actually need them.', when: 'When the counter has more cords than outlets.', h: 'Outlets and switches' },
      { img: 'stock-breaker-panel', w: 1000, h: 1000, alt: 'Close view of breakers and labelled wiring terminals inside an electrical panel',
        what: 'Updating an old panel or tired wiring so a busy shop has circuits laid out clearly.', when: 'When the shop has grown, new equipment has gone in, or the panel is original.', h: 'Panels and wiring updates' }
    ]
  };
  var swBtns = $$('.sw-btn');
  function setSwitch(k) {
    swBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === k)); });
    $$('.svc').forEach(function (li, i) {
      var d = SETS[k][i];
      li.classList.add('swap');
      setTimeout(function () {
        var img = $('img', li);
        img.src = 'images/' + d.img + '.jpg'; img.srcset = 'images/' + d.img + '-720.jpg 720w, images/' + d.img + '.jpg ' + d.w + 'w';
        img.width = d.w; img.height = d.h; img.alt = d.alt;
        $('.svc-what', li).textContent = d.what; $('.svc-when span', li).textContent = d.when; $('h3', li).textContent = d.h;
        img.onload = function () { li.classList.remove('swap'); };
        setTimeout(function () { li.classList.remove('swap'); }, 500);
      }, still ? 0 : 200 + i * 60);
    });
  }
  swBtns.forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('aria-pressed') !== 'true') setSwitch(b.getAttribute('data-set')); }); });

  /* ---------- BREAKER CHECK ---------- */
  var steps = $$('.step');
  function showStep(i, focus) {
    steps.forEach(function (s, j) {
      s.setAttribute('aria-selected', String(j === i)); s.tabIndex = j === i ? 0 : -1;
      var p = document.getElementById('sp-' + (j + 1)); if (p) p.hidden = j !== i;
    });
    var led = $('#brk-led'); if (led) led.setAttribute('fill', i === 3 ? '#E0523A' : '#F5C66A');
    $$('#brk rect').forEach(function (r, j) { r.setAttribute('fill', j <= i ? '#6B7885' : '#4F5B66'); });
    if (focus) steps[i].focus();
  }
  steps.forEach(function (s, i) {
    s.addEventListener('click', function () { showStep(i); });
    s.addEventListener('keydown', function (e) {
      var n = steps.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); showStep((i + 1) % n, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); showStep((i + n - 1) % n, true); }
    });
  });

  /* ---------- GALLERY ---------- */
  var chips = $$('.chip'), mas = $('.masonry');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      $$('figure', mas).forEach(function (fig) { fig.classList.toggle('off', f !== 'all' && fig.getAttribute('data-cat') !== f); });
      setTimeout(drawEscape, 50);
    });
  });
})();
