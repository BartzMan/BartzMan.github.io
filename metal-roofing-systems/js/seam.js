/* Metal Roofing Systems: pick-your-panel house, homeowners/contractors switch, six-question panels */
(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  /* ---------- pick your panel ---------- */
  var P = {
    seam: {
      no: '01', name: 'Standing seam', sub: 'Hidden fasteners, raised seams along every panel',
      shape: 'Long runs, gables, hips and lower-pitch porch roofs.',
      style: 'Brick ranches, farmhouse and modern homes.',
      look: 'Clean vertical lines, flat panels between the seams.',
      care: 'Fasteners sit under the seam, out of the weather. Keep valleys and gutters clear of leaves.',
      img: 'images/own-drone-charcoal-720.jpg', w: 720, h: 631,
      alt: 'Drone view of a large house with a charcoal standing-seam metal roof among trees',
      cap: 'From a Metal Roofing Systems job: charcoal standing seam, seen from the air.',
      colours: [['Texas sky', '#A9CBE4'], ['Galvalume', '#C5CBD0'], ['Charcoal', '#3A3F45'], ['Dark bronze', '#5A3E2B'], ['Patina green', '#5E8C7A'], ['Barn red', '#8E2F26']]
    },
    tile: {
      no: '02', name: 'Stone-coated steel', sub: 'Steel pressed into tile or shake shapes, finished in stone granules',
      shape: 'Pitched roofs with enough slope for a tile or shake look.',
      style: 'Mediterranean, Spanish-style and traditional homes.',
      look: 'The texture of tile or shake, with a matte, granular finish.',
      care: 'Keep it clear of branches and debris. Leave walking on it to the crew.',
      img: 'images/own-tile-samples-720.jpg', w: 720, h: 540,
      alt: 'Four stone-coated steel tile panels in terracotta, red, brown and black laid on grass',
      cap: 'From Metal Roofing Systems: stone-coated steel samples in four colours.',
      colours: [['Terracotta', '#C26A45'], ['Clay red', '#9A3F2E'], ['Walnut', '#5B3B2A'], ['Charcoal grit', '#3B3D40']]
    },
    rpanel: {
      no: '03', name: 'R-panel', sub: 'Exposed fasteners: ribbed panels screwed through the face',
      shape: 'Simple gables and shed roofs with long, straight runs.',
      style: 'Shops, barns, garages, carports and patio covers.',
      look: 'Bold, wide ribs and a hard-working, rural look.',
      care: 'The screw washers face the sun, so they are worth a look now and then from the ground.',
      draw: true, cap: 'Profile drawing: R-panel ribs with exposed screws.',
      colours: [['Galvalume', '#C5CBD0'], ['Charcoal', '#3A3F45'], ['Barn red', '#8E2F26'], ['Light stone', '#D8D2C2'], ['Texas sky', '#7FAACB']]
    },
    copper: {
      no: '04', name: 'Copper', sub: 'Soft metal, formed and seamed by hand',
      shape: 'Domes, cupolas, bay windows and accent roofs.',
      style: 'Traditional and stately homes, entries and focal points.',
      look: 'Bright penny at first, then brown, then a green patina over the years.',
      care: 'Usually left to weather naturally.',
      img: 'images/own-copper-dome-720.jpg', w: 720, h: 720,
      alt: 'A weathered green copper dome and cupola against a blue sky',
      cap: 'From a Metal Roofing Systems job: a copper dome, weathered to patina.',
      colours: [['New penny', '#C27A47'], ['Weathered brown', '#7A4A2E'], ['Patina', '#6FA08A']]
    }
  };

  function pattern(id, prof, c) {
    var d = shade(c, -0.32), l = shade(c, 0.45), m = shade(c, -0.12);
    if (prof === 'seam') return '<pattern id="' + id + '" width="22" height="40" patternUnits="userSpaceOnUse"><rect width="22" height="40" fill="' + c + '"/><rect x="11" width="11" height="40" fill="' + m + '" opacity=".25"/><rect width="2.6" height="40" fill="' + d + '"/><rect x="2.6" width="1.2" height="40" fill="' + l + '"/></pattern>';
    if (prof === 'tile') return '<pattern id="' + id + '" width="30" height="18" patternUnits="userSpaceOnUse"><rect width="30" height="18" fill="' + d + '"/><path d="M0 0H30V12C26 18 19 18 15 12 11 18 4 18 0 12Z" fill="' + c + '"/><path d="M0 12C4 18 11 18 15 12 19 18 26 18 30 12" fill="none" stroke="' + l + '" stroke-width=".9" opacity=".7"/><g fill="' + l + '" opacity=".55"><circle cx="5" cy="4" r=".8"/><circle cx="19" cy="7" r=".7"/><circle cx="26" cy="3" r=".6"/><circle cx="11" cy="9" r=".6"/></g><g fill="' + d + '" opacity=".6"><circle cx="8" cy="6" r=".7"/><circle cx="23" cy="9" r=".8"/><circle cx="15" cy="2" r=".6"/></g></pattern>';
    if (prof === 'rpanel') return '<pattern id="' + id + '" width="48" height="44" patternUnits="userSpaceOnUse"><rect width="48" height="44" fill="' + c + '"/><rect width="7" height="44" fill="' + l + '"/><rect x="7" width="2.4" height="44" fill="' + d + '"/><rect x="22" width="1.2" height="44" fill="' + d + '" opacity=".55"/><rect x="34" width="1.2" height="44" fill="' + d + '" opacity=".55"/><circle cx="14" cy="22" r="1.6" fill="' + d + '"/><circle cx="40" cy="22" r="1.6" fill="' + d + '"/></pattern>';
    return '<pattern id="' + id + '" width="26" height="60" patternUnits="userSpaceOnUse"><rect width="26" height="60" fill="' + c + '"/><circle cx="8" cy="14" r="7" fill="' + shade(c, 0.2) + '" opacity=".35"/><circle cx="19" cy="42" r="9" fill="' + m + '" opacity=".35"/><rect width="2.2" height="60" fill="' + d + '"/><rect x="2.2" width="1.2" height="60" fill="' + l + '"/></pattern>';
  }

  function drawProfile(prof) {
    var paths = {
      seam: 'M0 90h40l6-50h10l6 50h76l6-50h10l6 50h76l6-50h10l6 50h68',
      tile: 'M0 80c20-44 40-44 60 0s40 44 60 0 40-44 60 0 40 44 60 0 40-44 60 0',
      rpanel: 'M0 92h24l14-44h22l14 44h22l5-10 5 10h22l5-10 5 10h22l14-44h22l14 44h22l5-10 5 10h18',
      copper: 'M0 90h60l4-56h8l4 56h80l4-56h8l4 56h80l4-56h8l4 56h52'
    };
    var screws = prof === 'rpanel' ? '<g fill="#DDA678"><circle cx="49" cy="40" r="5"/><circle cx="257" cy="40" r="5"/><path d="M49 40v-26M257 40v-26" stroke="#DDA678" stroke-width="3"/></g>' : '';
    return '<rect width="320" height="120" fill="#22262B"/><g stroke="#3A4048"><path d="M0 30h320M0 60h320M0 90h320"/></g><path d="' + paths[prof] + '" fill="none" stroke="#C5CBD0" stroke-width="4" stroke-linejoin="round"/>' + screws +
      '<text x="12" y="112" fill="#C5CBD0" font-family="Geologica, sans-serif" font-size="11" letter-spacing="1.5">PROFILE SECTION</text>';
  }

  var house = $('.ss-house');
  if (house) {
    var defs = $('#ss-pats', house), roofNew = $('.ss-roof-new', house), roofOld = $('.ss-roof-old', house), sheen = $('.ss-roof-sheen', house);
    var spec = $('.ss-spec'), tag = $('.ss-stage-name'), tagSw = $('.ss-stage-sw'), colWrap = $('.ss-colours');
    var img = $('.ss-spec-img'), draw = $('.ss-spec-draw'), cap = $('.ss-spec-cap');
    var state = { prof: 'seam', col: 0 }, n = 0;

    function paint(animate) {
      var p = P[state.prof], c = p.colours[state.col] || p.colours[0];
      n++;
      var id = 'ss-pat-' + n;
      var tmp = document.createElementNS(NS, 'svg');
      tmp.innerHTML = pattern(id, state.prof, c[1]);
      defs.appendChild(tmp.firstChild);
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', '60'); r.setAttribute('y', '200'); r.setAttribute('width', '760'); r.setAttribute('height', '160'); r.setAttribute('fill', 'url(#' + id + ')');
      while (roofNew.firstChild) roofOld.appendChild(roofNew.firstChild);
      while (roofOld.children.length > 1) roofOld.removeChild(roofOld.firstChild);
      roofNew.appendChild(r);
      if (animate && !still) {
        roofNew.classList.remove('ss-wipe'); sheen.classList.remove('ss-go');
        void roofNew.getBoundingClientRect();
        roofNew.classList.add('ss-wipe'); sheen.classList.add('ss-go');
      }
      while (defs.children.length > 3) defs.removeChild(defs.firstChild);
      tag.textContent = p.name + ' \u00b7 ' + c[0];
      tagSw.style.setProperty('--cur', c[1]);
      $$('.ss-col', colWrap).forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === state.col)); });
    }

    function buildColours() {
      var p = P[state.prof];
      colWrap.innerHTML = '';
      p.colours.forEach(function (c, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'ss-col';
        b.setAttribute('aria-pressed', String(i === state.col));
        b.innerHTML = '<i style="--c:' + c[1] + '"></i>' + c[0];
        b.addEventListener('click', function () { state.col = i; paint(true); });
        colWrap.appendChild(b);
      });
    }

    function fillSpec() {
      var p = P[state.prof];
      $('.ss-spec-num', spec).textContent = p.no;
      $('.ss-spec-title', spec).textContent = p.name;
      $('.ss-spec-sub', spec).textContent = p.sub;
      $('.ss-sp-shape', spec).textContent = p.shape;
      $('.ss-sp-style', spec).textContent = p.style;
      $('.ss-sp-look', spec).textContent = p.look;
      $('.ss-sp-care', spec).textContent = p.care;
      if (p.draw) {
        img.hidden = true; draw.hidden = false; draw.innerHTML = drawProfile(state.prof);
      } else {
        img.hidden = false; draw.hidden = true;
        img.src = p.img; img.width = p.w; img.height = p.h; img.alt = p.alt;
      }
      cap.textContent = p.cap;
      if (!still) { spec.classList.remove('ss-swap'); void spec.offsetWidth; spec.classList.add('ss-swap'); }
    }

    $$('.ss-prof').forEach(function (b) {
      b.addEventListener('click', function () {
        state.prof = b.getAttribute('data-prof'); state.col = 0;
        $$('.ss-prof').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        buildColours(); fillSpec(); paint(true);
      });
    });
    buildColours(); paint(false);
  }

  /* ---------- homeowners / contractors ---------- */
  var sw = $('.ss-switch');
  if (sw) {
    var tabs = $$('[role="tab"]', sw);
    function pick(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t, pane = document.getElementById(x.getAttribute('aria-controls'));
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        pane.hidden = !on;
        if (on && !still) { pane.classList.remove('ss-in-anim'); void pane.offsetWidth; pane.classList.add('ss-in-anim'); }
      });
      sw.setAttribute('data-at', t.id === 'tab-con' ? 'con' : 'own');
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); }
      });
    });
  }

  /* ---------- six questions ---------- */
  var qs = $$('.ss-q');
  if (qs.length) {
    var count = $('.ss-ask-n'), bar = $('.ss-ask-bar');
    function open(q) {
      qs.forEach(function (x) {
        var on = x === q;
        x.setAttribute('data-open', String(on));
        $('.ss-q-btn', x).setAttribute('aria-expanded', String(on));
      });
    }
    function tally() {
      var k = qs.filter(function (x) { return x.getAttribute('data-asked') === 'true'; }).length;
      count.textContent = k; bar.style.setProperty('--n', k);
    }
    qs.forEach(function (q, i) {
      $('.ss-q-btn', q).addEventListener('click', function () { open(q); });
      var tick = $('.ss-q-tick', q);
      tick.addEventListener('click', function () {
        var on = tick.getAttribute('aria-pressed') !== 'true';
        tick.setAttribute('aria-pressed', String(on));
        tick.textContent = on ? 'Asked' : 'Asked it';
        q.setAttribute('data-asked', String(on));
        tally();
        if (on && qs[i + 1]) setTimeout(function () { open(qs[i + 1]); }, still ? 0 : 450);
      });
    });
  }
})();
