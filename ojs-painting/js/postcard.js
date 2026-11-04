/* OJ's Painting: flip the service postcards, and the sheen guide picker. */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Service postcards: flip to read the back (mouse, touch, keyboard via native buttons) */
  $$('.pc-pcard').forEach(function (card) {
    var btns = $$('.pc-flip', card);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = !card.classList.contains('is-flipped');
        card.classList.toggle('is-flipped', on);
        btns.forEach(function (x) { x.setAttribute('aria-expanded', on ? 'true' : 'false'); });
        var target = on ? card.querySelector('.pc-flip-back') : card.querySelector('.pc-flip:not(.pc-flip-back)');
        setTimeout(function () { if (target) target.focus({ preventScroll: true }); }, 380);
      });
    });
  });

  /* 2. Sheen guide: pick a room, the label shows the usual sheen and why */
  var D = {
    living: ['Living & bedrooms', 'Eggshell', ['eggshell'], 'A soft glow that wipes clean better than flat, without showing every bump in the wall.', '#card-interior', 'See the interior postcard'],
    kitchen: ['Kitchens & baths', 'Satin or semi-gloss', ['satin', 'semi'], 'Stands up to steam, splashes and scrubbing, so it is the usual pick where water and grease are.', '#card-interior', 'See the interior postcard'],
    ceiling: ['Ceilings', 'Flat', ['flat'], 'No glare from lights or windows, and it hides the small dips and patches every ceiling has.', '#card-interior', 'See the interior postcard'],
    trim: ['Trim & doors', 'Semi-gloss', ['semi'], 'Tough and easy to wipe, and the extra shine sets the edges apart from the walls.', '#card-trim', 'See the trim postcard'],
    outside: ['Outside siding', 'Flat or satin', ['flat', 'satin'], 'Use paint made for exteriors. Flatter finishes hide siding flaws; trim usually goes one step glossier.', '#card-exterior', 'See the exterior postcard']
  };
  var label = document.querySelector('.pc-label');
  var chips = $$('.pc-chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var d = D[c.getAttribute('data-room')];
      if (!d || !label) return;
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      label.querySelector('[data-out=room]').textContent = d[0];
      label.querySelector('[data-out=sheen]').textContent = d[1];
      label.querySelector('[data-out=why]').textContent = d[3];
      var go = label.querySelector('[data-out=go]');
      go.setAttribute('href', d[4]); go.textContent = d[5] + ' ▸';
      $$('.pc-scale li', label).forEach(function (li) { li.classList.toggle('is-on', d[2].indexOf(li.getAttribute('data-s')) > -1); });
    });
  });
})();
