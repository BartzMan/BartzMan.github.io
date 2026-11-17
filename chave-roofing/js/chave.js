(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* the gauge reading follows the page scroll: 0 to 10 inches */
  var rgIn = $('#rgIn');
  function reading() {
    var p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    if (rgIn) rgIn.textContent = (p * 10).toFixed(1);
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(reading); }, { passive: true });
  reading();

  /* where the water goes */
  var svg = $('#roofSvg');
  if (svg) {
    var LV = {
      1: {
        t: 'Drizzle: the slow finder',
        i: 'Light rain moves slowly, so it clings to the roof and creeps into the smallest gaps.',
        l: [[1, 'A pipe boot with a cracked rubber collar or dried-out sealant.'], [2, 'A lifted ridge cap or an exposed nail head near the ridge vent.']],
        c: 'Boot collars and sealant, ridge caps and vents, nail heads and shingle tabs.',
        pins: [1, 2], gut: 4
      },
      2: {
        t: 'Steady rain: the valley test',
        i: 'Hours of steady rain put a steady stream into every valley and along every wall.',
        l: [[3, 'The valley, where two roof planes pour into one channel.'], [4, 'Chimney and wall flashing where step flashing has lifted or sealant has dried out.']],
        c: 'Valley metal and shingles, step and counter flashing, and how the water leaves the roof into the gutters.',
        pins: [3, 4], gut: 12
      },
      3: {
        t: 'Gulf downpour: more than a roof can shed',
        i: 'A Gulf downpour sends water faster than valleys and gutters can carry it, and wind pushes it sideways.',
        l: [[5, 'The eave, when a full gutter backs water up under the first row of shingles.'], [3, 'A valley that overflows its channel and runs under the next plane.'], [2, 'Vents, when wind drives rain sideways into them.']],
        c: 'Gutter size and clear downspouts, drip edge laps, valley width and vent covers.',
        pins: [5, 3, 2], gut: 25
      }
    };
    var gutL = $('#gutL'), gutR = $('#gutR');
    function setLevel(n) {
      var d = LV[n];
      svg.setAttribute('data-level', n);
      $$('.rg-pick').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-lv') === n)); });
      $('#lvTitle').textContent = d.t;
      $('#lvIntro').textContent = d.i;
      var ul = $('#lvLeaks'); ul.textContent = '';
      d.l.forEach(function (x) {
        var li = document.createElement('li'), b = document.createElement('b'), s = document.createElement('span');
        b.textContent = x[0]; s.textContent = x[1]; li.appendChild(b); li.appendChild(s); ul.appendChild(li);
      });
      $('#lvChecks').textContent = d.c;
      $$('.pin', svg).forEach(function (p, i) { p.classList.toggle('on', d.pins.indexOf(i + 1) > -1); });
      [gutL, gutR].forEach(function (g) { g.setAttribute('y', 382 - d.gut); g.setAttribute('height', d.gut); });
    }
    $$('.rg-pick').forEach(function (b) { b.addEventListener('click', function () { setLevel(+b.getAttribute('data-lv')); }); });
    $$('.pin', svg).forEach(function (p, i) { p.style.cursor = 'pointer'; });
    setLevel(2);
  }

  /* repair / replace */
  var tabs = $$('.rg-seg [role="tab"]');
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
      var j = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
      if (j === null) return;
      e.preventDefault(); var n = tabs[(j + tabs.length) % tabs.length]; pick(n); n.focus();
    });
  });

  /* five leak signs: tap to fill a tube */
  var signs = $$('.rg-sign'), sgN = $('#sgN'), sgMsg = $('#sgMsg');
  function count() {
    var n = signs.filter(function (s) { return s.getAttribute('aria-pressed') === 'true'; }).length;
    sgN.textContent = n;
    sgMsg.textContent = n === 0
      ? 'Tap each sign you have noticed. Each one fills a tube.'
      : 'Take dated photos, move belongings away from any drips, and have the roof looked at before the next rain. If a light fixture is dripping, switch the power off at the breaker and call a pro.';
  }
  signs.forEach(function (s) { s.addEventListener('click', function () { s.setAttribute('aria-pressed', s.getAttribute('aria-pressed') !== 'true'); count(); }); });
})();
