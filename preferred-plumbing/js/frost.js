(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. THE HOUSE CUTAWAY */
  var parts = {
    shutoff: { tag: '1 · Main shutoff', title: 'Where the water stops.',
      does: 'Stops the water to the whole house at one valve. Everyone in the home should know where it is.',
      year: 'A split pipe in a hard freeze is the day you need it. A valve nobody has turned in years can stick, so test it gently before the cold comes.',
      svc: '<a href="#svc-leak">Leak and pipe repair</a>' },
    heater: { tag: '2 · Water heater', title: 'Hot water, all winter.',
      does: 'Heats the water for showers, sinks and the dishwasher, usually in the basement or a utility closet.',
      year: 'Incoming water is at its coldest in winter, so the tank works harder. Rusty water, a rumbling tank or a puddle at its base are signs to have it looked at.',
      svc: '<a href="#svc-heater">Water heater service</a>' },
    sump: { tag: '3 · Sump pit', title: 'The basement’s sump.',
      does: 'Collects groundwater around the foundation and pumps it outside so the basement stays dry.',
      year: 'Spring thaw and heavy rain are when it works hardest. A pump that is never tested, or loses power in a storm, can leave a wet basement. In winter a discharge pipe can freeze.',
      svc: 'The pipework around it: <a href="#svc-leak">Leak and pipe repair</a>' },
    spigot: { tag: '4 · Outdoor spigot', title: 'The tap on the wall.',
      does: 'Gives you water for the garden and the hose outside.',
      year: 'A hose left attached lets water sit in the tap and the pipe behind the wall. When it freezes it can split the pipe, often unseen until the tap is turned on in spring.',
      svc: '<a href="#svc-leak">Leak and pipe repair</a>' },
    sink: { tag: '5 · Kitchen sink', title: 'The busiest tap in the house.',
      does: 'Supplies hot and cold water and carries waste away through the drain and trap.',
      year: 'Slow drains, a drip at the faucet or a damp cabinet floor are small signs worth catching before a holiday full of dishes.',
      svc: '<a href="#svc-drain">Drain and fixture work</a> and <a href="#svc-faucet">fixture installs</a>' }
  };
  var box = $('#cutbox'), svg = $('.cut-svg');
  function layout() {
    if (!svg) return;
    var phone = window.innerWidth < 700;
    var vb = phone ? [180, 90, 520, 440] : [0, 0, 1000, 700];
    svg.setAttribute('viewBox', vb.join(' '));
    $$('.spot').forEach(function (s) {
      var x = +s.getAttribute('data-x'), y = +s.getAttribute('data-y');
      s.style.left = ((x - vb[0]) / vb[2] * 100) + '%';
      s.style.top = ((y - vb[1]) / vb[3] * 100) + '%';
    });
  }
  layout();
  window.addEventListener('resize', layout);
  var card = $('.cut-card');
  function pick(key, scroll) {
    var d = parts[key]; if (!d) return;
    $$('[data-spot]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-spot') === key)); });
    $$('#cc-media [data-m]').forEach(function (m) { m.hidden = m.getAttribute('data-m') !== key; });
    $('#cc-tag').textContent = d.tag; $('#cc-title').textContent = d.title;
    $('#cc-does').textContent = d.does; $('#cc-year').textContent = d.year; $('#cc-svc').innerHTML = d.svc;
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
    if (scroll && window.innerWidth <= 900) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $$('[data-spot]').forEach(function (b) {
    b.addEventListener('click', function () { pick(b.getAttribute('data-spot'), b.classList.contains('spot')); });
  });

  /* 2. SEASON TABS */
  var tabs = $$('.sea-tabs [role="tab"]');
  function seasonOn(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { seasonOn(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); seasonOn(n, true); }
    });
  });

  /* 3. BEFORE THE FREEZE CHECKLIST */
  var steps = $$('#drill button'), fill = $('#dm-fill'), txt = $('#dm-text');
  function meter() {
    var n = steps.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    fill.style.width = (n / steps.length * 100) + '%';
    txt.innerHTML = n === steps.length ? '<b>5 of 5</b> done. The pipes are ready for the cold. Stay warm.' : '<b>' + n + ' of 5</b> done. ' + (n ? 'Keep going.' : 'Tap a step to tick it off.');
  }
  steps.forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); meter(); });
  });

  /* 4. GALLERY FILTER */
  var chips = $$('.gal-chips button'), items = $$('.gi');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      items.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-tag') === f); });
    });
  });
})();
