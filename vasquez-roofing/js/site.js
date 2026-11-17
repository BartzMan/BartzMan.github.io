(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* header: the logo triangle and the pitch readout climb from 4/12 to 12/12 as the page scrolls */
  var tri = $('.logo-tri'), headP = $('#headPitch');
  function pitchFromScroll() {
    var p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    var r = 4 + p * 8;
    if (headP) headP.textContent = Math.round(r) + '/12';
    if (tri) tri.setAttribute('points', '3,30 33,30 33,' + (30 - 28 * r / 12).toFixed(1));
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(pitchFromScroll); }, { passive: true });
  pitchFromScroll();

  /* pitch finder */
  var svg = $('#houseSvg');
  if (svg) {
    var DATA = {
      4: { t: 'Low and wide', c: 'Ranch houses, additions, porches and garages.', s: 'Asphalt shingles are the usual choice. Water leaves slowly at this slope, so underlayment, laps and flashing get extra attention.', k: 'Easy footing and easy movement. The care goes into seams and flashings rather than into staging.' },
      5: { t: 'Gentle and common', c: 'Mid-century ranches and low gables.', s: 'Standard asphalt shingles over a good underlayment.', k: 'Comfortable footing. It is still a low slope, so eaves and flashings are checked closely.' },
      6: { t: 'The everyday Fort Worth slope', c: 'Ranch and Craftsman roofs, a slope many neighbourhood homes share.', s: 'Architectural asphalt shingles are the usual match, and most other roofing types work too.', k: 'Normal footing and normal staging. Few special measures are needed on a roof this easy to work.' },
      7: { t: 'A little more roof on show', c: 'Larger ranches and one-and-a-half storey homes.', s: 'Architectural shingles. More of the roof is visible from the street, so colour and pattern matter more.', k: 'Footing starts to ask for roof jacks and a steadier pace.' },
      8: { t: 'The two-storey new-build slope', c: 'Two-storey new builds and homes with a stronger roofline.', s: 'Architectural shingles. Valleys shed water quickly, and ridge lines carry more of the look of the house.', k: 'Roof jacks and fall protection become standard kit, and materials are staged more carefully.' },
      9: { t: 'Getting steep', c: 'Taller gables and larger dormers.', s: 'Shingles shed rain and leaves fast. Ridge and hip caps are very visible from the ground.', k: 'Fall protection and staging lead the plan, and each trip up carries less.' },
      10: { t: 'Cottage and Tudor fronts', c: 'Cottage-style fronts, steep dormers and cut-up roofs with many valleys.', s: 'Shingles with careful layout at the valleys, where several planes meet.', k: 'Harness-based work, slower movement, and more time spent on every valley.' },
      11: { t: 'Almost a wall', c: 'Period-style homes, towers and steep entry gables.', s: 'Shingles stay put well on a steep plane, but cuts and flashings are seen up close from the street.', k: 'Everything is harnessed and staged. The crew works on the slope rather than walking it.' },
      12: { t: 'The 45 degree roof', c: 'Steep gables, towers and period-style homes.', s: 'Shingles shed water and debris quickly. Ridge caps, flashings and details are seen from the ground.', k: 'Fall protection and staging lead everything, and the work is paced around safe footing.' }
    };
    var NS = 'http://www.w3.org/2000/svg', CX = 380, HALF = 290, GROUND = 440;
    var el = function (id) { return document.getElementById(id); };
    var roof = el('roof'), clip = el('roofClipPoly'), wall = el('wall'), fascia = el('fascia'), courses = el('courses');
    var chim = el('chim'), chimCap = el('chimCap'), winLow = el('winLow'), winUp = el('winUp');
    var rafter = el('rafterLine'), riseL = el('riseLine'), runL = el('runLine'), arc = el('arc'), lRise = el('lblRise'), lRun = el('lblRun'), tRise = el('tRise');
    var range = el('pitchRange');
    var state = { r: 6, wt: 320 }, target = { r: 6, s: 1 }, raf = null;
    function render(r, wt) {
      var rise = HALF * r / 12, peak = wt - rise;
      var s = Math.max(1, (GROUND + 20 - (peak - 40)) / 400), w = 760 * s, hh = 400 * s;
      svg.setAttribute('viewBox', ((760 - w) / 2).toFixed(1) + ' ' + (GROUND + 20 - hh).toFixed(1) + ' ' + w.toFixed(1) + ' ' + hh.toFixed(1));
      var pts = (CX - HALF) + ',' + wt + ' ' + CX + ',' + peak + ' ' + (CX + HALF) + ',' + wt;
      roof.setAttribute('points', pts); clip.setAttribute('points', pts);
      fascia.setAttribute('y', wt);
      wall.setAttribute('y', wt + 14); wall.setAttribute('height', GROUND - wt - 14);
      var roofY = function (x) { return wt - rise * (1 - Math.abs(x - CX) / HALF); };
      var top = roofY(490) - 62;
      chim.setAttribute('y', top); chim.setAttribute('height', wt - top);
      chimCap.setAttribute('y', top - 8);
      var tr = 'translate(0,' + (wt - 320) + ')';
      winUp.setAttribute('transform', tr); winLow.setAttribute('transform', '');
      /* shingle courses follow the eave */
      if (courses.getAttribute('data-wt') !== String(Math.round(wt)) || courses.getAttribute('data-r') !== String(Math.round(r * 10))) {
        var h = '';
        for (var y = wt - 14; y > peak - 6; y -= 15) h += '<line x1="' + (CX - HALF) + '" x2="' + (CX + HALF) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>';
        courses.innerHTML = h;
        courses.setAttribute('data-wt', Math.round(wt)); courses.setAttribute('data-r', Math.round(r * 10));
      }
      /* the framer's triangle */
      var ex = CX + HALF;
      rafter.setAttribute('x1', CX); rafter.setAttribute('y1', peak); rafter.setAttribute('x2', ex); rafter.setAttribute('y2', wt);
      riseL.setAttribute('x1', CX); riseL.setAttribute('y1', peak); riseL.setAttribute('x2', CX); riseL.setAttribute('y2', wt);
      runL.setAttribute('x1', CX); runL.setAttribute('y1', wt); runL.setAttribute('x2', ex); runL.setAttribute('y2', wt);
      var ang = Math.atan(r / 12), rad = 62;
      arc.setAttribute('d', 'M' + (ex - rad) + ' ' + wt + ' A' + rad + ' ' + rad + ' 0 0 0 ' + (ex - rad * Math.cos(ang)).toFixed(1) + ' ' + (wt - rad * Math.sin(ang)).toFixed(1));
      lRise.setAttribute('transform', 'translate(' + (CX - 120) + ',' + ((peak + wt) / 2 - 16).toFixed(1) + ')');
      lRun.setAttribute('transform', 'translate(' + (CX + HALF / 2 - 53) + "," + (wt - 40) + ')');
    }
    function words(r) {
      var d = DATA[r];
      var ang = Math.atan(r / 12) * 180 / Math.PI, raf = Math.sqrt(144 + r * r);
      $('#outP').textContent = r;
      $('#nRise').textContent = r + ' in';
      $('#nAng').textContent = ang.toFixed(1) + '°';
      $('#nRaf').textContent = raf.toFixed(1) + ' in';
      $('#outTitle').textContent = d.t; $('#outCommon').textContent = d.c; $('#outSuits').textContent = d.s; $('#outCrew').textContent = d.k;
      tRise.textContent = 'RISE ' + r + ' IN';
      range.value = r; range.setAttribute('aria-valuetext', r + ' in 12');
      $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(+c.getAttribute('data-p') === r && +c.getAttribute('data-s') === target.s)); });
      winUp.style.opacity = target.s === 2 ? 1 : 0;
    }
    function go(r, s) {
      target.r = r; if (s) target.s = s;
      words(r);
      var wt2 = target.s === 2 ? 220 : 320;
      if (still) { state.r = r; state.wt = wt2; render(r, wt2); return; }
      var from = { r: state.r, wt: state.wt }, t0 = null;
      if (raf) cancelAnimationFrame(raf);
      (function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 520), e = 1 - Math.pow(1 - k, 3);
        state.r = from.r + (r - from.r) * e; state.wt = from.wt + (wt2 - from.wt) * e;
        render(state.r, state.wt);
        if (k < 1) raf = requestAnimationFrame(step);
      })(performance.now());
    }
    range.addEventListener('input', function () { go(+range.value); });
    $$('.chip').forEach(function (c) { c.addEventListener('click', function () { go(+c.getAttribute('data-p'), +c.getAttribute('data-s')); }); });
    render(6, 320); words(6);
    $$('.chip')[1].setAttribute('aria-pressed', 'true');
  }

  /* tabs: new build / remodel / repair */
  var tabs = $$('.tr-tabs [role="tab"]');
  function pick(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null;
      if (j === null) return;
      e.preventDefault(); var n = tabs[(j + tabs.length) % tabs.length]; pick(n); n.focus();
    });
  });

  /* five roof questions: tap to settle, a rafter is set for each */
  var bfs = $$('.bf'), rafters = $$('#rafters line'), bfN = $('#bfN');
  function bfCount() {
    var n = 0;
    bfs.forEach(function (b, i) { var on = b.getAttribute('aria-pressed') === 'true'; if (on) n++; if (rafters[i]) rafters[i].classList.toggle('on', on); });
    if (bfN) bfN.textContent = n;
  }
  bfs.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); bfCount(); }); });
})();
