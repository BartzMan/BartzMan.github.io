(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------- Plate II: the specimen plate ---------- */
  var PARTS = [
    { name: 'Ridge cap', img: 'images/own-ridge-vent.jpg', w: 1200, h: 1600, cx: .72, cy: .5, z: 1.5,
      does: 'Caps the peak where two roof planes meet, and sheds water over the top.',
      hail: 'Look for cracked or missing cap shingles, and a ridge line that is no longer straight.' },
    { name: 'Hip', img: 'images/own-hip-valley.jpg', w: 1600, h: 900, cx: .62, cy: .75, z: 2.6,
      does: 'The sloping line where two roof planes meet at an outside corner. It takes the wind first.',
      hail: 'Check the hip caps for bruising, lifted edges or bare patches where the surface has worn away.' },
    { name: 'Valley', img: 'images/own-hip-valley.jpg', w: 1600, h: 900, cx: .44, cy: .67, z: 2.8,
      does: 'An inside corner where two slopes meet. It carries more water than anywhere else on the roof.',
      hail: 'Debris, loose grit piled up, or shingles cut back raggedly are worth a closer look.' },
    { name: 'Vent and boot', img: 'images/own-ridge-vent.jpg', w: 1200, h: 1600, cx: .47, cy: .34, z: 2.2,
      does: 'Vents let the attic breathe; the collar around each pipe, called the boot, seals it against rain.',
      hail: 'Dented caps, cracked collars, or a gap where the pipe meets the roof.' },
    { name: 'Chimney flashing', img: 'images/own-ranch-top.jpg', w: 1600, h: 1067, cx: .62, cy: .17, z: 3.4,
      does: 'Metal that steps up the sides of a chimney so water cannot slip in behind the bricks.',
      hail: 'Bent, lifted or rusty flashing, or a bead of sealant that has pulled away.' },
    { name: 'Drip edge', img: 'images/own-ranch-top.jpg', w: 1600, h: 1067, cx: .45, cy: .61, z: 3,
      does: 'A metal lip along the eaves that guides water into the gutter instead of behind it.',
      hail: 'Dents or bent edges, and shingles that overhang it unevenly.' }
  ];
  var cur = 0;
  var photo = $('#specPhoto');

  function crop(p) {
    if (!photo) return;
    var fw = photo.clientWidth || 600, fh = photo.clientHeight || 450;
    // size so that the image covers the frame at zoom 1, then zoom p.z
    var base = Math.max(fw / p.w, fh / p.h);
    var iw = p.w * base * p.z, ih = p.h * base * p.z;
    var left = Math.min(0, Math.max(fw - iw, fw / 2 - p.cx * iw));
    var top = Math.min(0, Math.max(fh - ih, fh / 2 - p.cy * ih));
    photo.style.backgroundImage = 'url("' + p.img + '")';
    photo.style.backgroundSize = iw + 'px ' + ih + 'px';
    photo.style.backgroundPosition = left + 'px ' + top + 'px';
  }
  function pick(i, focus) {
    cur = i;
    var p = PARTS[i];
    $('#specNo').textContent = 'No. ' + (i + 1) + ' of ' + PARTS.length;
    $('#specName').textContent = p.name;
    $('#specDoes').textContent = p.does;
    $('#specHail').textContent = p.hail;
    photo.setAttribute('aria-label', 'Own aerial photo cropped to the ' + p.name.toLowerCase());
    crop(p);
    $$('.hot').forEach(function (h) { h.classList.toggle('is-on', +h.getAttribute('data-part') === i); });
    $$('.spec-index button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-part') === i)); });
  }
  if (photo) {
    $$('.hot').forEach(function (h) {
      var i = +h.getAttribute('data-part');
      h.addEventListener('click', function () { pick(i); });
      h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } });
    });
    $$('.spec-index button').forEach(function (b) {
      b.addEventListener('click', function () { pick(+b.getAttribute('data-part')); });
    });
    pick(0);
    window.addEventListener('resize', function () { crop(PARTS[cur]); });
    // the plate draws itself when it scrolls into view
    var plate = $('[data-plate]');
    if (plate && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { plate.classList.add('drawn'); io.disconnect(); } }); }, { threshold: .25 });
      io.observe(plate);
      setTimeout(function () { var r = plate.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) plate.classList.add('drawn'); }, 300);
    } else if (plate) { plate.classList.add('drawn'); }
  }

  /* ---------- Plate IV: field notes ---------- */
  var sheet = $('[data-notes]');
  if (sheet) {
    var notes = $$('[data-note]', sheet), state = notes.map(function () { return ''; });
    var out = $('#noteResult'), cnt = $('#noteCount'), flag = $('#noteFlag');
    function render() {
      var done = state.filter(Boolean).length, off = state.filter(function (s) { return s === 'off'; }).length;
      cnt.textContent = done;
      flag.textContent = off ? '· ' + off + ' flagged' : '';
      if (!done) out.textContent = 'Tick each part as you look. Your field notes appear here.';
      else if (done < 5) out.textContent = off ? 'Noted. Keep going: ' + (5 - done) + ' part' + (5 - done > 1 ? 's' : '') + ' left to look at.' : (5 - done) + ' part' + (5 - done > 1 ? 's' : '') + ' left to look at.';
      else if (off) out.textContent = 'Something looks off. Photograph it from the ground, keep off the roof, and call a roofer to take a closer look.';
      else out.textContent = 'All five look fine from the street. Hail damage can still hide on the slopes, so a closer look after a big storm is never wasted.';
    }
    notes.forEach(function (n, i) {
      $$('button', n).forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-v');
          state[i] = state[i] === v ? '' : v;
          $$('button', n).forEach(function (x) { x.setAttribute('aria-pressed', String(state[i] === x.getAttribute('data-v'))); });
          render();
        });
      });
    });
  }

  /* ---------- Plate V: drawer tabs ---------- */
  var tabs = $$('.chips [role="tab"]');
  function openTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); openTab(n);
    });
  });
})();
