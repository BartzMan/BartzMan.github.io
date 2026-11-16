(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Lift & relay */
  var relay = $('[data-relay]');
  if (relay) {
    var steps = [
      null,
      ['Tiles lifted and stacked', 'The tiles are lifted off in sections and stacked to one side so the roof under them can be reached.'],
      ['Old underlayment off', 'The worn layer under the tiles is stripped back to the bare deck.'],
      ['Deck checked', 'The roof deck is looked over board by board before anything new goes on.'],
      ['New underlayment and battens', 'A fresh water-shedding layer goes down, then wooden battens give the tiles something to hang on.'],
      ['Tiles relaid', 'The tiles go back on from the eave up to the ridge, course by course, and any broken ones are replaced.']
    ];
    var tabs = $$('[data-s]', relay), figs = $$('[data-p]', relay), play = $('[data-play]', relay), timer = null;
    var setStep = function (n) {
      relay.setAttribute('data-step', n);
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-s') == n ? 'true' : 'false'); });
      figs.forEach(function (f) { f.hidden = f.getAttribute('data-p') != n; });
      $('[data-sn]', relay).textContent = n;
      $('[data-st]', relay).textContent = steps[n][0];
      $('[data-sd]', relay).textContent = steps[n][1];
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } play.classList.remove('on'); play.lastElementChild.textContent = 'Play'; };
    tabs.forEach(function (t) { t.addEventListener('click', function () { stop(); setStep(+t.getAttribute('data-s')); }); });
    play.addEventListener('click', function () {
      if (timer) { stop(); return; }
      var n = 0; play.classList.add('on'); play.lastElementChild.textContent = 'Stop';
      var tick = function () { n++; if (n > 5) { stop(); return; } setStep(n); };
      tick(); timer = setInterval(tick, 2400);
    });
    setStep(1);
  }

  /* Materials */
  var mat = $('[data-mat]');
  if (mat) {
    var mt = $$('[data-m]', mat), mp = $$('[data-mp]', mat);
    mt.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-m');
        mt.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        mp.forEach(function (p) { p.hidden = p.getAttribute('data-mp') !== k; });
      });
    });
  }

  /* Spotter */
  var spot = $('[data-spot]');
  if (spot) {
    var info = [
      null,
      ['Cracked or slipped tiles', 'A tile that sits crooked, has a visible crack or is missing leaves the layer beneath exposed.'],
      ['Debris in valleys', 'Leaves and grit packed into the valleys where two slopes meet can hold water against the tile.'],
      ['Gaps at the ridge and hip', 'Look along the top and the diagonal lines for cap tiles that have shifted or opened up.'],
      ['Stains on ceilings under valleys', 'Brown rings on a ceiling inside are worth a look, especially below a valley.'],
      ['Mortar falling from the ridge', 'Crumbs of mortar on the ground or in the gutters can mean the ridge bedding is breaking down.']
    ];
    var hs = $$('.hs', spot), btns = $$('.spot-list button', spot), specs = $$('.spec', spot);
    var setSpot = function (n) {
      hs.forEach(function (h) { h.classList.toggle('on', h.getAttribute('data-spot') == n); });
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-spot') == n ? 'true' : 'false'); });
      specs.forEach(function (s) { s.hidden = s.getAttribute('data-spec') != n; });
      $('[data-pn]', spot).textContent = n;
      $('[data-pt]', spot).textContent = info[n][0];
      $('[data-pd]', spot).textContent = info[n][1];
    };
    hs.forEach(function (h) {
      var go = function () { setSpot(+h.getAttribute('data-spot')); };
      h.addEventListener('click', go);
      h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    btns.forEach(function (b) { b.addEventListener('click', function () { setSpot(+b.getAttribute('data-spot')); }); });
    setSpot(1);
  }
})();
