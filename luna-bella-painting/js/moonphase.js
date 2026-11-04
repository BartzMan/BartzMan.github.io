/* Luna Bella Painting: moon-phase interactions (photo notes, light guide). The kit does menu, dock, lightbox, reveals and the form. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* exterior photo: tap a moon on the wall to read the note for that spot */
  var spots = $$('.ln-spot'), notes = $$('.ln-spot-notes p[data-note]');
  function showNote(i) {
    spots.forEach(function (s) { var on = s.getAttribute('data-note') === i; s.classList.toggle('is-on', on); s.setAttribute('aria-pressed', String(on)); });
    notes.forEach(function (n) { n.hidden = n.getAttribute('data-note') !== i; });
  }
  spots.forEach(function (s) { s.addEventListener('click', function () { showNote(s.getAttribute('data-note')); }); });

  /* light guide: the same three samples under morning, midday, evening and lamp light */
  var lab = document.querySelector('.ln-lab'), times = $$('.ln-times button'), tips = $$('.ln-tips p[data-tip]');
  function setLight(btn) {
    var t = btn.getAttribute('data-light');
    if (lab) lab.setAttribute('data-light', t);
    times.forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    tips.forEach(function (p) { p.hidden = p.getAttribute('data-tip') !== t; });
  }
  times.forEach(function (b) { b.addEventListener('click', function () { setLight(b); }); });
})();
