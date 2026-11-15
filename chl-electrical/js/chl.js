/* CHL Electrical: the three panel interactions (schedule side switch, breaker finder, six-signs tag). */
(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Homes & apartments / Buildings & businesses: re-labels the schedule, unused circuits read SPARE */
  var track = $('.side-switch-track'), sched = $('.sched'), count = $('[data-sched-count]');
  var cks = $$('.ckt');
  function setSide(side, first) {
    $$('.side-switch-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-side') === side)); });
    if (track) track.setAttribute('data-side', side);
    if (sched) sched.setAttribute('data-side', side);
    var live = 0;
    cks.forEach(function (c) {
      var on = (c.getAttribute('data-on') || '').split(' ').indexOf(side) > -1;
      c.classList.toggle('is-spare', !on);
      c.inert = !on;
      if (!on) return;
      live++;
      var p = $('.ckt-copy', c), t = p && p.getAttribute('data-' + side);
      if (t) p.textContent = t;
      if (!first) { c.classList.remove('is-live'); void c.offsetWidth; c.classList.add('is-live'); }
    });
    if (count) count.textContent = live + ' of ' + cks.length + ' circuits live for ' + (side === 'home' ? 'homes & apartments.' : 'buildings & businesses.');
  }
  $$('.side-switch-btn').forEach(function (b) {
    b.addEventListener('click', function () { setSide(b.getAttribute('data-side')); });
  });
  if (cks.length) setSide('home', true);

  /* 2. Which breaker is it? */
  var SYM = {
    flicker: { ckt: '5', label: 'CKT 05', name: 'Living-room lights',
      means: 'One lamp flickering is usually the bulb or a worn switch. Lights flickering in several rooms at once can point to a loose connection in the panel or where power comes in.',
      check: 'Tighten or swap the bulb. Notice whether it happens when something big starts up, like the A/C or the microwave.',
      call: 'It happens in more than one room, lights dim hard when appliances start, or you hear buzzing from a switch or the panel.' },
    micro: { ckt: '1', label: 'CKT 01', name: 'Kitchen counter outlets',
      means: 'The kitchen circuit is overloaded. A microwave, kettle or toaster each pull a lot of power, and two at once can be more than one circuit is meant to carry.',
      check: 'Unplug one appliance, then switch the breaker fully off and back on. Run the microwave on its own and see if it holds.',
      call: 'It trips with only the microwave running, trips again right after a reset, or the breaker feels warm.' },
    dead: { ckt: '7', label: 'CKT 07', name: 'Bedroom outlets',
      means: 'Often a tripped GFCI somewhere else on the same line (bathroom, kitchen or outside), a tripped breaker, or a loose wire at the outlet itself.',
      check: 'Look for a GFCI outlet with a popped button and press RESET. Check the panel for a breaker sitting in the middle position and reset it fully.',
      call: 'Nothing brings it back, other outlets go dead too, or the outlet looks scorched or feels warm.' },
    gfci: { ckt: '3', label: 'CKT 03', name: 'Bathroom GFCI',
      means: 'A GFCI that won\u2019t reset is either sensing a fault further down the line, often moisture or a faulty appliance, or the GFCI itself has worn out.',
      check: 'Unplug everything on it, let the area dry, then press RESET firmly. Make sure the breaker for that circuit is on.',
      call: 'It still won\u2019t reset, trips as soon as anything is plugged in, or the outlet is cracked or warm.' },
    warm: { ckt: '9', label: 'CKT 09', name: 'Hall switch & dimmer',
      means: 'Dimmers run a little warm while on. A plain switch or plate that is warm, or any switch that is hot, usually points to a loose connection or an overloaded dimmer.',
      check: 'Turn it off and leave it off. Note what it controls and feel the plate again after a few minutes.',
      call: 'It\u2019s hot to the touch, discoloured, buzzing or crackling, or the lights it runs flicker.' },
    smell: { ckt: 'main', label: 'MAIN', name: 'The whole panel',
      means: 'Something is overheating: an outlet, a fixture, a cord or the panel itself. This is not one to track down yourself.',
      check: 'Nothing at the panel. If it\u2019s safe, switch the power off and keep everyone away. Smoke or flame: leave and call 911.',
      call: 'Right away, once everyone is safe: (646) 379-9329.' }
  };
  var pnl = $('.pnl'), readout = $('.readout');
  function pick(key) {
    var d = SYM[key]; if (!d || !pnl || !readout) return;
    $$('.sym').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-sym') === key)); });
    $$('.brk', pnl).forEach(function (g) { g.classList.toggle('is-hot', g.getAttribute('data-ckt') === d.ckt); });
    pnl.classList.toggle('is-smell', key === 'smell');
    $('[data-r="ckt"]', readout).textContent = d.label;
    $('[data-r="name"]', readout).textContent = d.name;
    $('[data-r="means"]', readout).textContent = d.means;
    $('[data-r="check"]', readout).textContent = d.check;
    $('[data-r="call"]', readout).textContent = d.call;
    readout.classList.remove('is-swap'); void readout.offsetWidth; readout.classList.add('is-swap');
  }
  $$('.sym').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-sym')); }); });
  if (pnl) pick('flicker');

  /* 3. Six signs inspection tag */
  var signs = $$('.sign'), tally = $('[data-tally]'), cells = $$('.signs-meter i');
  function tallyUp() {
    var n = signs.filter(function (s) { return s.getAttribute('aria-pressed') === 'true'; }).length;
    cells.forEach(function (c, i) { c.classList.toggle('on', i < n); });
    if (!tally) return;
    tally.textContent = n === 0 ? 'Nothing flipped yet. Tap the signs you\u2019ve seen.'
      : n === 1 ? 'One sign on. Worth keeping an eye on, and worth mentioning when you call.'
      : n + ' signs on. Time to have an electrician look at the wiring.';
  }
  signs.forEach(function (s) {
    s.addEventListener('click', function () { s.setAttribute('aria-pressed', String(s.getAttribute('aria-pressed') !== 'true')); tallyUp(); });
  });
})();
