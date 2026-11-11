(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* generic tablist helper */
  function tabs(list, show) {
    list.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % list.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i + list.length - 1) % list.length;
        if (j > -1) { e.preventDefault(); show(j); list[j].focus(); }
      });
    });
  }

  /* 1. system finder: three answers print a label */
  var DATA = {
    ms: { name: 'Ductless mini-split', img: 'images/own-minisplit-gauges.jpg', cap: 'Mini-split outdoor unit, mid-install',
      plain: 'An outdoor unit outside and one or more indoor heads on the wall, joined by thin refrigerant lines. There is no ductwork to build, so it suits single rooms, additions and homes without ducts.',
      ask: 'How many indoor heads you need and where the outdoor unit can sit.' },
    fa: { name: 'Furnace and air handler', img: 'images/own-furnace.jpg', cap: 'Furnace and ductwork in a closet',
      plain: 'A furnace and air handler pair that uses ducts to heat and cool the whole home from one place, often a closet or attic. It works best where good ductwork is already in place.',
      ask: 'The condition of the existing ducts and where the flue and drain run.' },
    rt: { name: 'Rooftop package unit', img: 'images/own-rooftop-unit.jpg', cap: 'Rooftop package unit on a flat roof',
      plain: 'Heating and cooling in one box on the roof, sending air down through ducts. It suits shops, offices and other buildings with a flat roof and no floor space to spare.',
      ask: 'Roof access, the curb the unit sits on and how the ducts run below.' },
    vrv: { name: 'VRV system', img: 'images/own-vrv-panel.jpg', cap: 'Label panel on a VRV outdoor unit',
      plain: 'One outdoor unit feeding many indoor units, each with its own control. It suits larger buildings with many rooms or zones that need different settings.',
      ask: 'How the zones are laid out and where the outdoor unit can go.' }
  };
  var ORDER = ['ms', 'fa', 'rt', 'vrv'];
  var ans = {};
  function score(a) {
    var s = a.q1 === 'home' ? { ms: 50, fa: 40, rt: 5, vrv: 15 } : { ms: 40, fa: 25, rt: 50, vrv: 45 };
    var biz = a.q1 === 'business';
    if (a.q2 === 'ducts') { s.fa += 35; s.rt += 25; s.ms -= 10; s.vrv -= 5; }
    if (a.q2 === 'noducts') { s.ms += 30; s.vrv += 15; s.fa -= 30; s.rt -= 10; }
    if (a.q3 === 'few') { s.ms += 30; s.vrv -= 30; s.rt -= 25; s.fa -= 15; }
    if (a.q3 === 'some') { s.ms += 10; s.fa += 10; }
    if (a.q3 === 'all') { s.ms -= 25; s.fa += biz ? 0 : 15; s.rt += biz ? 25 : 0; s.vrv += biz ? 30 : 10; }
    ORDER.forEach(function (k) { s[k] = Math.max(0, Math.min(100, s[k])); });
    return s;
  }
  function render() {
    var s = score(ans), best = ORDER[0];
    ORDER.forEach(function (k) { if (s[k] > s[best]) best = k; });
    var d = DATA[best];
    $('#lbl-name').textContent = d.name;
    $('#lbl-plain').textContent = d.plain;
    $('#lbl-ask').textContent = d.ask;
    var img = $('#lbl-img'); img.src = d.img; img.alt = d.cap;
    $('#lbl-cap').textContent = d.cap;
    $$('#bars li').forEach(function (li) {
      var k = li.getAttribute('data-s'), v = s[k];
      li.className = v >= 70 ? 'hi' : (v >= 40 ? 'mid' : 'lo');
      li.querySelector('.b-bar i').style.width = Math.max(6, v) + '%';
      li.querySelector('.b-v').textContent = v >= 70 ? 'Usually fits' : (v >= 40 ? 'Could fit' : 'Less likely');
    });
    var lbl = $('#lbl');
    $('#lbl-empty').hidden = true; lbl.hidden = false;
    lbl.classList.remove('print'); void lbl.offsetWidth; lbl.classList.add('print');
  }
  $$('.q').forEach(function (q) {
    var key = 'q' + q.getAttribute('data-q');
    var bs = $$('button', q);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        bs.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        ans[key] = b.getAttribute('data-v');
        if (ans.q1 && ans.q2 && ans.q3) render();
      });
    });
  });

  /* 2. system tabs */
  var st = $$('.sys-tab');
  if (st.length) {
    tabs(st, function (i) {
      st.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
    });
  }

  /* 3. heat pump or furnace */
  var sw = $$('.swap button');
  if (sw.length) {
    tabs(sw, function (i) {
      sw.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
    });
  }
})();
