/* Torres signwriter: sign filter, turn-the-sign details, read the boards (kit.js does menu, dock, lightbox, reveals, form). */
(function () {
  'use strict';

  /* outside / inside tags */
  var grid = document.querySelector('.ts-signgrid');
  var tags = document.querySelectorAll('.ts-tag');
  tags.forEach(function (t) {
    t.addEventListener('click', function () {
      var s = t.getAttribute('data-show');
      tags.forEach(function (o) { o.setAttribute('aria-pressed', o === t ? 'true' : 'false'); });
      grid.querySelectorAll('.ts-svc').forEach(function (c) { c.hidden = s !== 'all' && c.getAttribute('data-side') !== s; });
      grid.classList.toggle('ts-filtered', s !== 'all');
    });
  });

  /* turn the sign over: what the job usually covers */
  document.querySelectorAll('.ts-flip').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = b.closest('.ts-svc-card');
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      card.querySelector('.ts-svc-back').hidden = !open;
      card.querySelector('.ts-svc-front').hidden = open;
      b.textContent = open ? 'Turn it back' : 'Turn the sign over';
      card.classList.remove('is-flipped'); void card.offsetWidth; card.classList.add('is-flipped');
    });
  });

  /* read the boards */
  var reads = [
    ['Peeling', 'Paint lifting in flakes, usually from moisture getting in behind it.', 'find and fix the moisture first, scrape the loose paint, prime bare spots, then repaint.'],
    ['Chalking', 'A powdery film that rubs off on your hand: the paint is breaking down in the sun.', 'wash the chalk off before any new coat, or the new paint will not hold.'],
    ['Cracking', 'Fine cracks or an alligator pattern: old layers have lost their flex.', 'it usually needs scraping or sanding back to a sound surface before repainting.'],
    ['Fading', 'Colour washed out on the sunniest sides first.', 'cosmetic at first, but an early sign the finish is wearing thin. Plan a repaint before it starts to chalk or peel.'],
    ['Bare wood & mildew', 'Grey bare wood or dark spots: water is getting at the boards.', 'clean the mildew, let the wood dry, and get bare wood primed and painted soon.']
  ];
  var samples = document.querySelectorAll('.ts-sample');
  var panel = document.getElementById('board-read');
  function read(i) {
    var r = reads[i];
    panel.querySelector('.ts-read-h').textContent = r[0];
    panel.querySelector('.ts-read-what').textContent = r[1];
    var d = panel.querySelector('.ts-read-do');
    d.textContent = ''; var b = document.createElement('b'); b.textContent = 'What to do: '; d.appendChild(b); d.appendChild(document.createTextNode(r[2]));
    samples.forEach(function (s, j) { s.setAttribute('aria-selected', j === i ? 'true' : 'false'); s.tabIndex = j === i ? 0 : -1; });
  }
  samples.forEach(function (s, i) {
    s.addEventListener('click', function () { read(i); });
    s.addEventListener('keydown', function (e) {
      var j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % samples.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + samples.length) % samples.length;
      if (j > -1) { e.preventDefault(); samples[j].focus(); read(j); }
    });
  });
})();
