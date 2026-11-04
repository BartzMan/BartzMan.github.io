/* Jarvis: AIRFLOW interactions (follow-the-air stepper with season switch, symptom picker) */
(function () {
  var STOPS = {
    winter: [
      { k: 'return side', h: 'Return grille', a: '#svc-maint', at: 'Maintenance',
        p: 'Air from the rooms comes back here, usually through one or two big grilles. A couch or a pile of boxes in front of it starves the whole system of air.' },
      { k: 'return side', h: 'Filter', a: '#svc-maint', at: 'Maintenance',
        p: 'Right before the furnace, the filter catches the dust the return pulled in. A clogged filter is the most common reason the airflow drops.' },
      { k: 'the heart of it', h: 'Furnace and blower', a: '#svc-heat', at: 'Furnace repair & install',
        p: 'In winter the burners heat the air and the blower pushes it on. No heat, short cycling or a blower that never stops: this is where most heating repairs happen.' },
      { k: 'resting in winter', h: 'Cooling coil', a: '#svc-cool', at: 'Central air repair & install',
        p: 'The coil sits on top of the furnace. In winter it just lets the warm air pass; it gets its turn when the AC runs in summer.' },
      { k: 'supply side', h: 'Supply registers', a: '#svc-heat', at: 'Furnace repair & install',
        p: 'Warm air leaves the trunk and comes out of a register in every room. A room that never warms up usually traces back to the supply run feeding it.' }
    ],
    summer: [
      { k: 'return side', h: 'Return grille', a: '#svc-maint', at: 'Maintenance',
        p: 'Warm, humid room air comes back here. Keep the grille clear: in summer the AC needs every bit of air it can get to keep the coil from icing.' },
      { k: 'return side', h: 'Filter', a: '#svc-maint', at: 'Maintenance',
        p: 'A dirty filter in summer can freeze the coil and leave the house warm. Check it every month or two while the AC is running.' },
      { k: 'moving the air', h: 'Blower', a: '#svc-cool', at: 'Central air repair & install',
        p: 'The furnace burners stay off in summer, but its blower still moves all the air through the coil and out to the rooms.' },
      { k: 'the cold part', h: 'Coil and condenser', a: '#svc-cool', at: 'Central air repair & install',
        p: 'The coil cools and dries the air; the copper lines carry the heat out to the condenser in the yard, which pushes it outside.' },
      { k: 'supply side', h: 'Supply registers', a: '#svc-cool', at: 'Central air repair & install',
        p: 'Cool air comes out of every register. Warm air from the vents, or one room that never cools, is the sign to call.' }
    ]
  };
  var dg = document.querySelector('.af-diagram');
  var parts = document.querySelectorAll('.af-dg-part');
  var tabs = document.querySelectorAll('.af-stop-b');
  var el = { k: document.getElementById('st-k'), h: document.getElementById('st-h'), p: document.getElementById('st-p'), a: document.getElementById('st-a') };
  var cur = 1;
  function season() { return dg ? dg.getAttribute('data-season') : 'winter'; }
  function show(n) {
    cur = n; var s = STOPS[season()][n - 1]; if (!s || !el.h) return;
    if (dg) dg.classList.add('has-stop');
    parts.forEach(function (p) { p.classList.toggle('on', +p.getAttribute('data-part') === n); });
    tabs.forEach(function (t) { var on = +t.getAttribute('data-stop') === n; t.classList.toggle('is-on', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    el.k.textContent = 'Stop ' + n + ' of 5 · ' + s.k; el.h.textContent = s.h; el.p.textContent = s.p;
    el.a.setAttribute('href', s.a); el.a.firstChild.nodeValue = s.at + ' ';
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(+t.getAttribute('data-stop')); }); });
  document.querySelectorAll('.af-stop-step').forEach(function (b) {
    b.addEventListener('click', function () { var n = cur + (+b.getAttribute('data-dir')); show(n < 1 ? 5 : n > 5 ? 1 : n); });
  });
  document.querySelectorAll('.af-season-b').forEach(function (b) {
    b.addEventListener('click', function () {
      if (dg) dg.setAttribute('data-season', b.getAttribute('data-season'));
      document.querySelectorAll('.af-season-b').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      show(cur);
    });
  });
  if (dg) show(1);

  /* symptom picker */
  var sy = document.querySelectorAll('.af-sym');
  function pick(t) {
    sy.forEach(function (o) { var on = o === t; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1;
      var p = document.getElementById(o.getAttribute('aria-controls')); if (p) p.hidden = !on; });
  }
  sy.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); var n = sy[(i + d + sy.length) % sy.length]; pick(n); n.focus(); }
    });
  });
})();
