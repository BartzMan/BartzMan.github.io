/* Hernandez Paint: roller-stripe interactions (steps, sheen guide, stroke roll-ins). The kit does menu, dock, lightbox, reveals and the form. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* decorative strokes roll across when they come into view */
  var rolls = $$('[data-roll]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-rolled'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rolls.forEach(function (r) { io.observe(r); });
  } else rolls.forEach(function (r) { r.classList.add('is-rolled'); });

  /* how a room gets painted: one step open, the roller track fills to it */
  var steps = $$('.rs-step'), track = document.querySelector('.rs-track');
  function setStep(i) {
    steps.forEach(function (s, k) {
      var on = k === i, b = s.querySelector('button'), body = s.querySelector('.rs-step-body');
      b.setAttribute('aria-expanded', String(on));
      body.hidden = !on;
      s.classList.toggle('is-on', on);
      s.classList.toggle('is-done', k < i);
    });
    if (track) track.style.setProperty('--fill', ((i + 1) / steps.length).toFixed(3));
  }
  steps.forEach(function (s, k) { s.querySelector('button').addEventListener('click', function () { setStep(k); }); });
  if (steps.length) setStep(0);

  /* sheen guide: pick a room, the matching sheen strokes light up and the advice changes */
  var rooms = $$('.rs-rooms button'), marks = $$('.rs-scale-list li'), notes = $$('.rs-advice p');
  function pick(btn) {
    var picks = btn.getAttribute('data-picks').split(','), room = btn.getAttribute('data-room');
    rooms.forEach(function (r) { var on = r === btn; r.classList.toggle('is-on', on); r.setAttribute('aria-pressed', String(on)); });
    marks.forEach(function (m) { m.classList.toggle('is-pick', picks.indexOf(m.getAttribute('data-i')) > -1); });
    notes.forEach(function (n) { n.hidden = n.getAttribute('data-for') !== room; });
  }
  rooms.forEach(function (r) { r.addEventListener('click', function () { pick(r); }); });
})();
