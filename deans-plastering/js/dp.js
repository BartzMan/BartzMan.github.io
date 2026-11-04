/* Dean's Plastering: concept interactions (finish sampler, service boards, crack reader, gallery filters). Kit does the rest. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* radiogroup helper: click, arrows, roving tabindex */
  function radios(group, onPick) {
    var items = $$('[role="radio"]', group);
    function pick(b, focus) {
      items.forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
      if (focus) b.focus();
      onPick(b, items.indexOf(b));
    }
    items.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        pick(items[(i + n + items.length) % items.length], true);
      });
    });
  }

  /* 1. finish sampler: the new finish is troweled onto the board in an arc */
  var finishes = {
    float: ['Sand float', 'A fine, sandy grain left by working the last coat with a float. It hides small waves and touch-ups well, which is why so many stucco walls wear it.'],
    lace: ['Lace', 'Flat islands of plaster troweled over a rougher coat, like lace or a skip-trowel pattern. It reads hand-made and old-world, with shadows in the low spots.'],
    smooth: ['Smooth', 'A tight, troweled finish with soft clouds of movement in it. Calm and plain, but it shows every patch, so repairs need a careful hand to blend.']
  };
  var board = document.getElementById('board'), tag = document.getElementById('board-tag');
  var fName = document.getElementById('fin-name'), fText = document.getElementById('fin-text');
  var fg = document.querySelector('.tr-floats');
  if (fg && board) radios(fg, function (b) {
    var k = b.getAttribute('data-finish');
    if (board.getAttribute('data-finish') === k) return;
    fName.textContent = finishes[k][0]; fText.textContent = finishes[k][1];
    tag.textContent = 'Sample board · ' + finishes[k][0].toLowerCase();
    var set = function () { board.className = 'tr-board tx-' + k; board.setAttribute('data-finish', k); };
    if (still) { set(); return; }
    var layer = document.createElement('div');
    layer.className = 'tr-board-new tx-' + k;
    board.insertBefore(layer, board.firstChild);
    layer.addEventListener('animationend', function () { set(); board.removeChild(layer); });
  });

  /* 2. service boards: one open at a time */
  var rows = $$('.tr-row');
  rows.forEach(function (row) {
    var btn = row.querySelector('.tr-row-h button');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      rows.forEach(function (r) {
        var b = r.querySelector('.tr-row-h button'), d = r.querySelector('.tr-row-body');
        var on = r === row && open;
        b.setAttribute('aria-expanded', String(on)); d.hidden = !on; r.classList.toggle('is-open', on);
      });
    });
  });

  /* 3. USEFUL: read a crack */
  var cracks = [
    ['Hairline', 'Thin cracks are common as stucco cures and the house settles. Mark the ends with a pencil and watch whether they grow.'],
    ['Spiderweb', 'A web of fine surface cracks is usually cosmetic, but sealing it keeps water from finding a way in.'],
    ['Wide or stepped', 'A crack you can slip a coin edge into, or one that keeps growing, is worth a look. Water behind stucco is the worry.'],
    ['Stains or bulges', 'Dark streaks under windows, soft spots, or a wall that sounds hollow when tapped can mean moisture behind it. Call a pro.']
  ];
  var cg = document.querySelector('.tr-swatches');
  var cNo = document.getElementById('crack-no'), cH = document.getElementById('crack-h'), cP = document.getElementById('crack-p');
  var cIll = document.getElementById('crack-ill');
  if (cg) radios(cg, function (b, i) {
    cNo.textContent = 'Crack ' + (i + 1) + ' of 4'; cH.textContent = cracks[i][0]; cP.textContent = cracks[i][1];
    var svg = b.querySelector('svg'); if (cIll && svg) cIll.innerHTML = svg.outerHTML;
  });

  /* 4. gallery filters */
  var gal = document.querySelector('.tr-gallery');
  var chips = $$('.tr-chips button');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      $$('.tr-shot', gal).forEach(function (s) { s.hidden = f !== 'all' && s.getAttribute('data-k') !== f; });
      gal.classList.toggle('is-filtered', f !== 'all');
    });
  });
})();
