/* ICI Electric: meter bank. Vanilla JS. */
(function () {
  'use strict';
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* header + scroll dial */
  var top = $('#top'), needle = $('#sdNeedle'), tick = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    top.classList.toggle('solid', y > 30);
    if (needle) needle.style.transform = 'rotate(' + (-135 + 270 * (h > 0 ? Math.min(1, y / h) : 0)).toFixed(1) + 'deg)';
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* phone menu */
  var burger = $('.burger'), sheet = $('#sheet');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('open'); }); }
    else { sheet.classList.remove('open'); setTimeout(function () { if (!sheet.classList.contains('open')) sheet.hidden = true; }, 320); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1240 && burger.getAttribute('aria-expanded') === 'true') setMenu(false); });

  /* reveal */
  var rv = $$('[data-reveal]');
  rv.forEach(function (e) {
    var sibs = $$('[data-reveal]', e.parentElement).filter(function (s) { return s.parentElement === e.parentElement; });
    e.style.setProperty('--d', Math.max(0, sibs.indexOf(e)));
  });
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (e) { io.observe(e); });
  } else rv.forEach(function (e) { e.classList.add('in'); });

  /* HERO REGISTER */
  var dials = $('#dials');
  if (dials) {
    var cfg = [[84, 14], [148, 10], [212, 7], [276, 5]], nds = [];
    cfg.forEach(function (c, i) {
      var g = el('g', { transform: 'translate(' + c[0] + ' 156)' }, dials);
      el('circle', { r: 28, fill: '#fff', stroke: '#17181a', 'stroke-width': 2.5 }, g);
      for (var k = 0; k < 10; k++) {
        var a = k * 36 * Math.PI / 180;
        el('line', { x1: (Math.sin(a) * 23).toFixed(1), y1: (-Math.cos(a) * 23).toFixed(1), x2: (Math.sin(a) * 27).toFixed(1), y2: (-Math.cos(a) * 27).toFixed(1), stroke: '#17181a', 'stroke-width': 1.6 }, g);
      }
      var n = el('g', { 'class': 'nd' + (i % 2 ? ' rev' : '') }, g);
      el('path', { d: 'M0 4 L0 -21', stroke: '#d93a2b', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, n);
      el('circle', { r: 3.2, fill: '#17181a' }, g);
      n.style.setProperty('--t', c[1] + 's'); n.dataset.base = c[1]; nds.push(n);
    });
    var load = 0, val = 417, odo = $$('#odo text');
    var setLoad = function () {
      var f = 1 + load * 0.9;
      nds.forEach(function (n) { n.style.setProperty('--t', (n.dataset.base / f).toFixed(2) + 's'); });
    };
    $$('.reg-sw button').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-checked') !== 'true';
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        load += on ? +b.dataset.w : -b.dataset.w; setLoad();
      });
    });
    if (!RM) setInterval(function () {
      val += 1 + load * 2;
      var s = ('00000' + (val % 100000)).slice(-5);
      odo.forEach(function (t, i) { t.textContent = s.charAt(i); });
    }, 700);
  }

  /* SERVICES: wall of meters */
  var SV = [
    { u: 'UNIT 1A', t: 'Meter & service work', p: 'The meter and the main switch beside it are where power enters a building. You need an electrician when they are damaged, outdated, or being moved or upgraded.', i: 'own-meter-room', w: 1600, h: 1200, alt: 'Meters and a disconnect box mounted on a white painted brick wall', c: 'Meter and disconnect wall', a: -50 },
    { u: 'UNIT 2B', t: 'Meter banks', p: 'In an apartment building each unit has its own meter, often grouped in one meter room. Work here means adding, labelling or replacing meters and the wiring that feeds them.', i: 'stock-brick-facade', w: 1600, h: 1067, alt: 'Brick apartment building facade with fire escapes seen from the street', c: 'Apartment building (stock)', a: 40 },
    { u: 'UNIT 3C', t: 'Panels & wiring', p: 'The panel is the box of breakers that splits power across your home or unit. It needs attention when breakers trip often, it is full, or it is old.', i: 'own-panel', w: 1200, h: 1600, alt: 'Open electrical panel with rows of breakers and neatly routed wires', c: 'Panel, wired', a: 95 },
    { u: 'UNIT 4D', t: 'Lighting & fixtures', p: 'New sconces, ceiling lights and switches, wired and mounted so they work and look the way you pictured them.', i: 'own-sconces', w: 1600, h: 750, alt: 'Two glass globe wall sconces lit on a white wall', c: 'Sconces, lit', a: 135 },
    { u: 'UNIT 5E', t: 'Outlets & repairs', p: 'Outlets that are dead or loose, and switches that no longer work. Small repairs, worth having done properly.', i: 'ill-outlet', ext: 'svg', w: 1600, h: 800, alt: 'Drawing of two outlets and a switch on a grey wall', c: 'Illustration', a: -100 }
  ];
  var wallBtns = $$('#meters button.mtr');
  var needles = [];
  function faceSVG(label) {
    var s = el('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true', focusable: 'false' });
    var d = el('defs', {}, s), gr = el('radialGradient', { id: 'gl' + label, cx: '.3', cy: '.25', r: '.9' }, d);
    el('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': .6 }, gr); el('stop', { offset: .5, 'stop-color': '#fff', 'stop-opacity': .05 }, gr); el('stop', { offset: 1, 'stop-color': '#000', 'stop-opacity': .15 }, gr);
    el('circle', { cx: 60, cy: 60, r: 58, fill: '#101112' }, s);
    el('circle', { cx: 60, cy: 60, r: 54, fill: '#3a3d42', stroke: '#6a6e74', 'stroke-width': 2 }, s);
    el('circle', { cx: 60, cy: 60, r: 47, fill: '#ecebe6' }, s);
    el('path', { d: 'M22 52a42 42 0 0 1 76 0', fill: 'none', stroke: '#1F9E86', 'stroke-width': 8 }, s);
    el('rect', { x: 34, y: 42, width: 52, height: 17, rx: 2, fill: '#101112' }, s);
    var t = el('text', { x: 60, y: 55, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono,monospace', 'font-size': 13, 'font-weight': 500, fill: '#FFD60A' }, s); t.textContent = label;
    for (var k = 0; k < 12; k++) { var a = (k * 30 - 90) * Math.PI / 180; el('line', { x1: (60 + Math.cos(a) * 38).toFixed(1), y1: (82 + Math.sin(a) * 22).toFixed(1), x2: (60 + Math.cos(a) * 42).toFixed(1), y2: (82 + Math.sin(a) * 26).toFixed(1), stroke: '#17181a', 'stroke-width': 1.6 }, s); }
    var n = el('g', { transform: 'translate(60 82)' }, s), nn = el('g', { 'class': 'mneedle' }, n);
    el('path', { d: 'M0 4 L0 -26', stroke: '#d93a2b', 'stroke-width': 3, 'stroke-linecap': 'round' }, nn);
    el('circle', { cx: 0, cy: 0, r: 4, fill: '#17181a' }, n);
    el('circle', { cx: 60, cy: 60, r: 47, fill: 'url(#gl' + label + ')' }, s);
    return { svg: s, needle: nn };
  }
  wallBtns.forEach(function (b, i) {
    var f = faceSVG(['1A', '2B', '3C', '4D', '5E'][i]);
    $('.mtr-face', b).appendChild(f.svg);
    f.needle.style.transition = 'transform 1s cubic-bezier(.3,1.6,.5,1)';
    f.needle.style.transform = 'rotate(' + (-70 + i * 12) + 'deg)';
    needles.push(f.needle);
  });
  var rd = { u: $('#rdUnit'), img: $('#rdImg'), cap: $('#rdCap'), t: $('#rdT'), p: $('#rdP') };
  function pickService(i) {
    var s = SV[i];
    wallBtns.forEach(function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      needles[k].style.transform = 'rotate(' + (k === i ? s.a : (-70 + k * 12)) + 'deg)';
    });
    rd.u.textContent = s.u; rd.t.textContent = s.t; rd.p.textContent = s.p; rd.cap.textContent = s.c;
    rd.img.style.opacity = 0;
    setTimeout(function () {
      var ext = s.ext || 'jpg';
      if (ext === 'svg') { rd.img.removeAttribute('srcset'); rd.img.src = 'images/' + s.i + '.svg'; }
      else { rd.img.src = 'images/' + s.i + '-720.jpg'; rd.img.srcset = 'images/' + s.i + '-720.jpg 720w, images/' + s.i + '.jpg ' + s.w + 'w'; rd.img.sizes = '(max-width:1000px) 92vw, 640px'; }
      rd.img.width = s.w; rd.img.height = s.h; rd.img.alt = s.alt;
      rd.img.style.opacity = 1;
    }, RM ? 0 : 160);
  }
  wallBtns.forEach(function (b, i) { b.addEventListener('click', function () { pickService(i); }); });
  // idle needle sway
  if (!RM) setInterval(function () {
    wallBtns.forEach(function (b, k) { if (b.getAttribute('aria-pressed') !== 'true') needles[k].style.transform = 'rotate(' + (-70 + k * 12 + (Math.random() * 14 - 7)).toFixed(1) + 'deg)'; });
  }, 2600);

  /* WHO TO CALL picker */
  var ICON = {
    L: '<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 36V12l14-8 14 8v24M6 36h28M14 36V22h6v14M24 18h4v4h-4z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
    E: '<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M23 3 9 23h9l-3 14 16-22h-9.5z" fill="currentColor"/></svg>',
    U: '<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3v34M8 10h24M11 18h18M20 37 12 37M20 37h8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>'
  };
  var NAMES = { apt: ['Landlord or super', 'Electrician', 'Utility company'], house: ['You, first', 'Electrician', 'Utility company'] };
  var D = {
    'apt.dead': { hi: [0], t: ['Check the breakers in your unit and press any GFCI reset button. If it stays dead, tell your landlord or super: they usually look after the building wiring.', 'Usually arranged through the landlord, not by you.', 'Not needed unless the whole building is out.'] },
    'apt.unit': { hi: [0], t: ['Check the breakers in your unit, then ask a neighbour if they have power. If only you are out, tell the super.', 'If the super finds the fault is in your unit wiring, they usually send one.', 'If neighbours are out too, report it.'] },
    'apt.grid': { hi: [2], t: ['Let the super know so the building can plan.', 'Not needed: the fault is outside your wiring.', 'Report the outage to your utility company. They know about wider outages and fix the supply.'] },
    'apt.trip': { hi: [0, 1], t: ['Stop resetting it again and again. Unplug what was running and tell your landlord.', 'A breaker that keeps tripping points to an overload or a fault. An electrician should look.', 'Not usually needed.'] },
    'apt.box': { hi: [2, 0], t: ['Keep people back and tell the super. If you see sparks, smoke or smell burning, leave and call 911. Do not touch it.', 'Repairs on the building side follow, once it is safe.', 'Damage on the supply side of the meter is theirs to deal with. Report it.'] },
    'apt.flick': { hi: [0], t: ['One lamp: try another bulb. Many lights flickering: tell your landlord.', 'If it keeps happening, it is worth having an electrician look.', 'Only if neighbours see it too.'] },
    'house.dead': { hi: [0], t: ['Look for a tripped breaker in the panel and press any GFCI reset button (kitchen, bath, garage). Reset a tripped breaker once.', 'If it trips again or stays dead, call one.', 'Only if the neighbours are out too.'] },
    'house.unit': { hi: [0, 2], t: ['Look outside: are the neighbours dark too? Then check the main breaker in your panel.', 'If only your house is dark and the main breaker is fine, call one.', 'If the whole street is out, report it to your utility company.'] },
    'house.grid': { hi: [2], t: ['Stay put and keep fridge doors shut. Check for an outage report.', 'Not needed: the fault is outside your wiring.', 'Report it to your utility company and wait for the supply to be restored.'] },
    'house.trip': { hi: [1], t: ['Unplug what was running. Resetting again and again can hide a real problem.', 'Call one to find the cause.', 'Not usually needed.'] },
    'house.box': { hi: [2, 1], t: ['Keep everyone back and do not touch the meter or cable. If you see sparks, smoke or smell burning, leave and call 911.', 'Repairs on your side of the meter follow, once the utility says it is safe.', 'Damage on the supply side of the meter is theirs to deal with. Report it.'] },
    'house.flick': { hi: [1], t: ['Try a new bulb. If it is one fixture, the fixture or its switch may be at fault.', 'Flicker across many lights is worth an electrician.', 'Only if neighbours see it too.'] }
  };
  var who3 = $('#who3');
  function paintWho() {
    var home = $('input[name=home]:checked').value, issue = $('input[name=issue]:checked').value, d = D[home + '.' + issue], k = ['L', 'E', 'U'];
    who3.innerHTML = '';
    d.t.forEach(function (txt, i) {
      var div = document.createElement('div');
      div.className = 'wt' + (d.hi.indexOf(i) >= 0 ? ' hi' : '');
      div.innerHTML = ICON[k[i]] + '<span class="dymo">' + (d.hi.indexOf(i) >= 0 ? 'Start here' : 'Also') + '</span><h3></h3><p></p>';
      $('h3', div).textContent = NAMES[home][i]; $('p', div).textContent = txt;
      who3.appendChild(div);
    });
  }
  $$('.pick input').forEach(function (i) { i.addEventListener('change', paintWho); });
  paintWho();

  /* quote form: preview only */
  var form = $('#quote'), note = $('#fNote');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    note.classList.add('show');
    note.textContent = 'Preview only: this form goes live with the finished site. For now, call or text (347) 299-4044.';
  });
})();
