/* Barrier Roofing: dock doors, site plan, audience switch, walk-around log, lens zoom. Plain JS. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dock doors lift as they come into view ---------- */
  var docks = $$('[data-dock]');
  function dockUpdate() {
    var vh = window.innerHeight;
    docks.forEach(function (d) {
      var r = d.getBoundingClientRect();
      var t = still ? 1 : Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (vh * 0.5)));
      d.style.setProperty('--lift', (1 - Math.pow(1 - t, 3)).toFixed(3));
    });
  }
  var tick = false;
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; dockUpdate(); }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  dockUpdate();

  /* ---------- site plan ---------- */
  var B = {
    A: { bay: 1, name: 'Coated flat roof', own: true,
         text: 'A flat roof finished in a white reflective coating over the existing surface. From above it reads as one bright, continuous sheet.',
         list: ['Standing water in low spots', 'Coating worn thin where people and equipment walk', 'Edges and seams that have started to lift'] },
    B: { bay: 2, name: 'Metal building roof', own: false,
         text: 'Ribbed metal panels over a warehouse, shop or workshop. Long panels, long runs of laps and a lot of fasteners.',
         list: ['Fasteners backing out or loosening', 'Sealant drying out at the laps and the ridge', 'Rust starting at cut edges and scratches'] },
    C: { bay: 3, name: 'Low-slope roof with rooftop units', own: true,
         text: 'A low roof carrying rooftop air-conditioning units and vents. Every unit sits on a curb, and every curb is a detail to keep sealed.',
         list: ['Sealant cracking around unit curbs and pipes', 'Water collecting near the units', 'Flashing lifting where the roof meets a wall'] },
    D: { bay: 4, name: 'Skylights and roof penetrations', own: true,
         text: 'Skylights, vents and pipes poking through a flat roof. Every opening is a place where the roof surface has to be sealed back to the curb or collar.',
         list: ['Leaks around the skylight curb', 'Cracked pipe collars and boots', 'Sealant or coating worn thin at the edges'] },
    E: { bay: 5, name: 'Storage row roofs', own: true,
         text: 'Long, narrow roofs over rows of storage units. Plenty of roof, with a lot of seams and edges to look after.',
         list: ['Many seams, so many places to fail', 'Water collecting at the low end of each row', 'Fasteners working loose over time'] },
    F: { bay: 6, name: 'Large L-shaped metal building', own: true,
         text: 'Two roof planes meeting at a corner on a bigger metal building. Where they meet is where the work gets detailed.',
         list: ['The valley where the two roofs meet', 'Gutters and downspouts that cannot keep up', 'Flashing where the roof meets a wall'] }
  };
  var cur = 'C';
  function selectB(k, focus) {
    cur = k;
    var d = B[k];
    $$('.bld').forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-b') === k); });
    $$('.bchips button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-b') === k ? 'true' : 'false'); });
    $$('.bp-img').forEach(function (i) { i.classList.toggle('is-on', i.getAttribute('data-b') === k); });
    $('#bp-letter').textContent = k;
    $('#bp-bay').textContent = 'Building ' + k + ' · Bay ' + d.bay;
    $('#bp-name').textContent = d.name;
    $('#bp-text').textContent = d.text;
    $('#bp-cap').innerHTML = d.own ? '<b>OWN</b> Barrier\'s own photo' : '<b>STOCK</b> Illustrative stock photo';
    $('#bp-list').innerHTML = d.list.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    var p = $('.bpanel'); p.classList.remove('bp-swap'); void p.offsetWidth; p.classList.add('bp-swap');
  }
  $$('.bld').forEach(function (g) {
    var k = g.getAttribute('data-b');
    g.addEventListener('click', function () { selectB(k); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectB(k); } });
  });
  $$('.bchips button').forEach(function (b) { b.addEventListener('click', function () { selectB(b.getAttribute('data-b')); }); });
  selectB('C');

  /* ---------- audience switch ---------- */
  var AUD = {
    owners: {
      lead: 'You own the building, and the roof is what keeps everything else under it dry. It pays to know what the roof needs.',
      coat: 'A white reflective coating system is applied over a flat roof and seals the surface. It is one way to deal with an aging flat roof.',
      flat: 'Shops, offices and warehouses usually have flat or low-slope roofs. They drain slowly, so water and seams are what to watch.',
      metal: 'Metal roofs on warehouses and workshops are tough, but fasteners, laps and sealant still need a look from time to time.',
      repair: 'A leak shows up inside long after it started outside. Repair means finding the real way in, then sealing it.'
    },
    managers: {
      lead: 'You look after buildings for other people. Clear roof information makes repair and budget talks easier.',
      coat: 'One coating system across a whole roof means one scope to describe, one area to measure and fewer separate fixes to track.',
      flat: 'A flat roof with rooftop units has many small details. Know where the drains, curbs and seams are before something leaks.',
      metal: 'Metal roofs across several buildings add up. Fasteners, laps and ridge caps are the usual items on a punch list.',
      repair: 'Log where it leaks, when it rained and what is underneath. That gives a roofer a faster start.'
    },
    homeowners: {
      lead: 'A house can leak too. Roof repair and leak repair is the place to start, and the other services are good to know about.',
      coat: 'Coatings suit flat and low-slope roofs, like a flat addition or a carport roof. Ask whether yours is a fit.',
      flat: 'A flat porch, garage or addition roof is a cousin of a commercial roof: it drains slowly, so keep it clear and look for standing water.',
      metal: 'Barns, sheds and workshops with metal roofs need the same care as a warehouse: fasteners and laps first.',
      repair: 'Brown ring on the ceiling? Take a photo, note the date and call. Leak repair starts with finding where it gets in.'
    }
  };
  var audBtns = $$('.aud button');
  function pickAud(k, focus) {
    audBtns.forEach(function (b) { var on = b.getAttribute('data-a') === k; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    var d = AUD[k];
    $('#aud-lead').textContent = d.lead;
    $$('.sv-text').forEach(function (p) {
      p.classList.remove('sv-swap'); void p.offsetWidth;
      p.textContent = d[p.getAttribute('data-s')]; p.classList.add('sv-swap');
    });
  }
  audBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { pickAud(b.getAttribute('data-a')); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = (i + (e.key === 'ArrowRight' ? 1 : audBtns.length - 1)) % audBtns.length;
        pickAud(audBtns[n].getAttribute('data-a'), true); e.preventDefault();
      }
    });
  });

  /* ---------- walk-around log ---------- */
  var STOPS = [
    { t: 'Ponding water', p: 'Water still standing on the roof after the rain has stopped. Note where it collects and roughly how big the patch is.' },
    { t: 'Blisters or cracks', p: 'Raised bubbles in the surface, or fine cracks. Photograph them and mark where they are on a sketch of the roof.' },
    { t: 'Open seams', p: 'Seams or laps where an edge has lifted or pulled apart. Mark how long the open stretch is.' },
    { t: 'Clogged drains and scuppers', p: 'Leaves, debris or silt sitting in a drain, or blocking the opening in the parapet wall. Log where, and note how much.' },
    { t: 'Flashing around units', p: 'The metal and sealant around rooftop units, vents and pipes. Look for gaps, lifted edges and sealant that has cracked.' }
  ];
  var stop = 0, logged = {};
  function renderStop() {
    var s = STOPS[stop];
    $('#stop-no').textContent = 'STOP ' + (stop + 1);
    $('#stop-title').textContent = s.t;
    $('#stop-text').textContent = s.p;
    var on = !!logged[stop];
    var b = $('#stop-log'); b.setAttribute('aria-pressed', on ? 'true' : 'false'); $('#stop-log-t').textContent = on ? 'Logged: tap to undo' : 'Log it';
    $$('.stop').forEach(function (g) {
      var n = +g.getAttribute('data-n') - 1;
      g.classList.toggle('is-on', n === stop); g.classList.toggle('is-logged', !!logged[n]);
    });
    var keys = Object.keys(logged).filter(function (k) { return logged[k]; }).map(Number).sort();
    $('#punch').innerHTML = keys.map(function (k) { return '<li><b>' + (k + 1) + '</b> ' + STOPS[k].t + '</li>'; }).join('');
    var n = keys.length;
    $('#punch-note').textContent = n === 0 ? 'Nothing logged yet.' : (n < 3 ? n + ' logged. Photos and a sketch make this list more useful to a roofer.' : n + ' logged. That is a good list to hand to a roofer.');
    var p = $('.stop-card'); p.classList.remove('sc-swap'); void p.offsetWidth; p.classList.add('sc-swap');
  }
  $$('.stop').forEach(function (g) {
    var n = +g.getAttribute('data-n') - 1;
    g.addEventListener('click', function () { stop = n; renderStop(); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop = n; renderStop(); } });
  });
  $('#stop-log').addEventListener('click', function () { logged[stop] = !logged[stop]; renderStop(); });
  renderStop();

  /* ---------- lens zoom ---------- */
  var Z = 2.6;
  $$('[data-zv]').forEach(function (fig) {
    var frame = $('.zv-frame', fig), lens = $('.zv-lens', fig), img = $('img', frame), note = $('.zv-note', fig);
    var src = fig.getAttribute('data-img'), pos = { x: 40, y: 40 };
    function place(px, py, smooth) {
      pos.x = Math.max(0, Math.min(100, px)); pos.y = Math.max(0, Math.min(100, py));
      var w = frame.clientWidth, h = frame.clientHeight, lw = lens.offsetWidth;
      lens.classList.toggle('lens-glide', !!smooth);
      lens.style.left = (pos.x / 100 * w) + 'px'; lens.style.top = (pos.y / 100 * h) + 'px';
      lens.style.backgroundImage = 'url("' + src + '")';
      lens.style.backgroundSize = (w * Z) + 'px ' + (h * Z) + 'px';
      lens.style.backgroundPosition = (-(pos.x / 100 * w * Z - lw / 2)) + 'px ' + (-(pos.y / 100 * h * Z - lw / 2)) + 'px';
    }
    function fromEvent(e) {
      var r = frame.getBoundingClientRect();
      place((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100, false);
    }
    frame.addEventListener('pointermove', fromEvent);
    frame.addEventListener('pointerdown', fromEvent);
    frame.addEventListener('keydown', function (e) {
      var d = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] }[e.key];
      if (d) { e.preventDefault(); place(pos.x + d[0], pos.y + d[1], true); }
    });
    $$('.zv-spots button', fig).forEach(function (b) {
      b.addEventListener('click', function () {
        place(+b.getAttribute('data-x'), +b.getAttribute('data-y'), true);
        note.textContent = b.getAttribute('data-note');
        $$('.zv-spots button', fig).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      });
    });
    var first = $('.zv-spots button', fig);
    first.setAttribute('aria-pressed', 'true');
    function init() { place(+first.getAttribute('data-x'), +first.getAttribute('data-y'), false); }
    if (img.complete) init(); else img.addEventListener('load', init);
    window.addEventListener('resize', function () { place(pos.x, pos.y, false); });
  });
})();
