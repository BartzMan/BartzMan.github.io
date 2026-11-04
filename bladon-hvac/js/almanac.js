/* Bladon: almanac interactions (Plate I figures, Table II season filter, season wheel) */
(function () {
  var FIGS = {
    a: 'A shut-off switch on the wall, within sight of the unit, so it can be powered down safely before anyone works on it.',
    b: 'The fan on top pulls air up through the coil and blows the heat taken out of the house into the yard.',
    c: 'Behind the wire guard is the coil. Keep plants, leaves and grass clippings a couple of feet clear of it so air can get through.',
    d: 'The unit sits level on a pad, up off the soil, so it stays steady and water drains away from it.',
    e: 'The shipping carton is still on the grass: this unit had just been set when the photo was taken.'
  };
  var figBtns = document.querySelectorAll('[data-fig]');
  var k = document.getElementById('fig-k'), p = document.getElementById('fig-p');
  function fig(id) {
    if (!FIGS[id] || !p) return;
    figBtns.forEach(function (b) { var on = b.getAttribute('data-fig') === id; b.classList.toggle('is-on', on); if (b.classList.contains('al-fig')) b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    k.textContent = 'Fig. ' + id.toUpperCase(); p.textContent = FIGS[id];
  }
  figBtns.forEach(function (b) { b.addEventListener('click', function () { fig(b.getAttribute('data-fig')); }); });

  /* Table II filter */
  var table = document.querySelector('.al-table');
  var chips = document.querySelectorAll('.al-chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var s = c.getAttribute('data-sea');
      chips.forEach(function (o) { var on = o === c; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      if (!table) return;
      table.classList.toggle('is-filtered', s !== 'all');
      table.querySelectorAll('.al-row').forEach(function (r) { r.classList.toggle('is-match', s !== 'all' && (' ' + r.getAttribute('data-sea') + ' ').indexOf(' ' + s + ' ') > -1); });
    });
  });

  /* season wheel */
  var qs = document.querySelectorAll('.al-q');
  var hub = document.getElementById('hub-s');
  function pick(t) {
    qs.forEach(function (o) { var on = o === t; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(o.getAttribute('aria-controls')); if (panel) panel.hidden = !on; });
    if (hub) hub.textContent = t.textContent.trim();
  }
  qs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (d) { e.preventDefault(); var n = qs[(i + d + qs.length) % qs.length]; pick(n); n.focus(); }
    });
  });
})();
