(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* the deck: tall chips that fan open */
  $$('[data-cards]').forEach(function (box) {
    var cards = $$('.fd-cc', box);
    function open(c) {
      cards.forEach(function (x) {
        var on = x === c;
        x.classList.toggle('is-open', on);
        x.querySelector('.fd-cc-hd').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }
    cards.forEach(function (c) {
      c.addEventListener('click', function () { if (!c.classList.contains('is-open')) open(c); });
      c.querySelector('.fd-cc-hd').addEventListener('click', function (e) { e.stopPropagation(); open(c); });
    });
  });

  /* finish picker */
  var FIN = [
    { f: 'FOR CEILINGS', n: 'Flat', g: 0, t: 'No shine at all. It hides small bumps and does not glare under lights, which is why it is the usual choice overhead.' },
    { f: 'FOR BEDROOMS AND LIVING ROOMS', n: 'Eggshell', g: .33, t: 'A soft sheen that looks calm and can be wiped lightly. A common pick for the walls of rooms people live in.' },
    { f: 'FOR KITCHENS AND BATHS', n: 'Satin', g: .66, t: 'A little more sheen stands up better to steam and splashes, and it wipes clean more easily than a flat finish.' },
    { f: 'FOR TRIM AND DOORS', n: 'Semi-gloss', g: 1, t: 'The hardest-wearing, easiest-to-wipe sheen. It also makes trim and doors stand out from the walls around them.' }
  ];
  $$('[data-picker]').forEach(function (tabs) {
    var btns = $$('button', tabs), card = document.getElementById('sheenCard'), dot = document.getElementById('sheenDot');
    function pick(b) {
      var k = +b.getAttribute('data-k'), d = FIN[k];
      btns.forEach(function (x) { var on = x === b; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
      card.style.setProperty('--g', d.g);
      dot.style.setProperty('--p', k);
      document.getElementById('sheenFor').textContent = d.f;
      document.getElementById('sheenName').textContent = d.n;
      document.getElementById('sheenText').textContent = d.t;
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
        if (n === null) return; n = (n + btns.length) % btns.length; btns[n].focus(); pick(btns[n]); e.preventDefault();
      });
    });
  });

  /* room filter */
  $$('.fd-filter').forEach(function (f) {
    var btns = $$('button', f), figs = $$('.fd-gi');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        figs.forEach(function (fg) { fg.hidden = !(k === 'all' || fg.getAttribute('data-cat') === k); });
      });
    });
  });
})();
