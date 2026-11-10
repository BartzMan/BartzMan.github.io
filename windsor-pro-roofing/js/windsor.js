(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. engraved plates: turn over */
  $$('[data-plate]').forEach(function (pl) {
    var front = pl.querySelector('.ep-turn'), back = pl.querySelector('.ep-turn-back');
    function turn(on) {
      pl.classList.toggle('is-turned', on);
      front.setAttribute('aria-pressed', String(on));
      setTimeout(function () { (on ? back : front).focus({ preventScroll: true }); }, 450);
    }
    front.addEventListener('click', function () { turn(true); });
    back.addEventListener('click', function () { turn(false); });
  });

  /* 2. plate book filter */
  var chips = $$('.ep-chip'), figs = $$('.ep-g');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      figs.forEach(function (g) {
        var k = g.getAttribute('data-kind');
        g.hidden = !(f === 'all' || k === f || k === 'all');
      });
    });
  });

  /* 3. which roof suits which building */
  var tabs = $$('.ep-bt');
  function pick(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    $$('.ep-bp').forEach(function (p) { p.hidden = p.id !== 'bp-' + t.getAttribute('data-b'); });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i + tabs.length - 1) % tabs.length;
      if (j > -1) { e.preventDefault(); pick(tabs[j], true); }
    });
  });
})();
