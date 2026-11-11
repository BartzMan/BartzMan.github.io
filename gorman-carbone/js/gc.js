(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };

  /* tappable house */
  var parts = {
    roof: ['Roof', 'The roof takes the sun, the rain and the snow, so it is the part of the house that tires first. Dormers, valleys and edges are where water likes to get in, so a roofer looks there first.', 'images/roof.jpg', 950, 595, 'Dark shingle roof with two white dormers on a cream Cape-style house'],
    siding: ['Siding', 'Siding is the outer skin of the walls. When boards are loose, warped or cracked, rain can get in behind them, and that is when it is time to have a look.', 'images/stock-porch.jpg', 1600, 1067, 'A covered front porch with white columns on a house along a residential street'],
    windows: ['Windows', 'Windows are where the house lets light in and should keep wind and wet out. Fogged panes, soft frames and gaps around the edges are the usual signs one needs replacing.', 'images/stock-bungalow.jpg', 1600, 1067, 'A white house with many windows among autumn trees'],
    gutters: ['Gutters', 'Gutters and downspouts carry rain off the roof and away from the walls. Overflowing water, sagging runs and stains on the board behind them mean they need attention.', 'images/eave.jpg', 640, 360, 'Roof edge with white trim and gutter above a front porch']
  };
  var panel = $('[data-panel]');
  var chips = $$('.chip'), gs = $$('[data-g]');
  function pick(k) {
    var d = parts[k];
    chips.forEach(function (c) { var on = c.dataset.part === k; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
    gs.forEach(function (g) { g.classList.toggle('is-on', g.dataset.g === k); });
    var im = $('[data-panel-img]', panel);
    im.src = d[2]; im.width = d[3]; im.height = d[4]; im.alt = d[5];
    $('[data-panel-h]', panel).textContent = d[0];
    $('[data-panel-p]', panel).textContent = d[1];
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { pick(c.dataset.part); }); });
  gs.forEach(function (g) {
    g.addEventListener('click', function () { pick(g.dataset.g); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.dataset.g); } });
  });
  pick('roof');

  /* tear-off or overlay */
  var xs = $('[data-xsec]'), tt = $('[data-tear-txt]');
  var modes = {
    tear: ['Tear-off', 'The old shingles come off down to the wood deck. The deck gets a look, repairs where it needs them, then new underlayment and shingles go on. It is the cleanest way to see what is under there.'],
    over: ['Overlay', 'New shingles go over the old layer. It can mean less mess and less waste, but the old layer stays, and any problem under it stays hidden. It only suits a flat, sound roof, so ask what the roofer sees.']
  };
  $$('.seg-b').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.dataset.mode;
      $$('.seg-b').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
      xs.setAttribute('data-xsec', m);
      $('h3', tt).textContent = modes[m][0];
      $('p', tt).textContent = modes[m][1];
    });
  });

  /* checklist gauge */
  var list = $('[data-check]');
  if (list) {
    var boxes = $$('input', list), bar = $('[data-gauge]'), txt = $('[data-gauge-txt]');
    var sun = $('.gauge-sun'), rays = $('.gauge-rays'), cloud = $('.gauge-cloud');
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length, f = n / boxes.length;
      bar.style.width = (f * 100) + '%';
      sun.style.opacity = f; rays.style.opacity = f; cloud.style.opacity = 1 - f * .9;
      txt.textContent = n === boxes.length ? 'All done. The sun is out.' : n + ' of ' + boxes.length + ' done. ' + (n ? 'Clearing up.' : 'Clouds closing in.');
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
  }
})();
