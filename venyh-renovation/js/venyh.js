/* Venyh Renovation: trowel-sweep reveals, the cracked-to-finished wall, finish tabs and the before-you-paint boards. */
(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* trowel sweep: each heading is wiped in by an arc, once */
  var sweeps = $$('.sweep');
  if (still || !('IntersectionObserver' in window)) sweeps.forEach(function (s) { s.classList.add('is-swept'); });
  else {
    /* watch the parent: Chrome reports a fully clipped element as never intersecting */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        sweeps.forEach(function (s) { if (s.parentElement === e.target) s.classList.add('is-swept'); });
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    sweeps.forEach(function (s) { io.observe(s.parentElement); });
    window.addEventListener('load', function () { setTimeout(function () {
      sweeps.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight) s.classList.add('is-swept'); });
    }, 80); });
  }

  /* 1. Cracked to finished */
  var STAGES = [
    { name: 'Cracked plaster', fix: 'Loose and hollow plaster is cut back or secured, and cracks are opened slightly so the filler has something to grip.', skip: 'Cracks come straight back through the new paint, often along the same lines.' },
    { name: 'Tape & mud', fix: 'Mesh or paper tape bridges each crack and joint, and joint compound buries it, so the wall moves as one piece.', skip: 'Filler on its own shrinks and splits, and the crack line shows again.' },
    { name: 'Skim coat', fix: 'A thin coat of compound is troweled over the whole wall, blending patches, dents and old texture into one flat plane.', skip: 'Patches show as dull or shiny spots, and side light picks up every ridge.' },
    { name: 'Prime', fix: 'Primer seals the fresh compound so the paint dries evenly and grips the wall.', skip: 'Paint soaks into the patched areas unevenly (painters call it flashing) and can peel.' },
    { name: 'Two coats of paint', fix: 'Two finish coats give full, even colour and a surface that can be wiped clean.', skip: 'One coat over new plaster often looks patchy, with the repairs still visible in the light.' }
  ];
  var wall = $('.wall'), range = $('#stage-range'), card = $('.stage-card');
  function setStage(n, from) {
    n = Math.max(0, Math.min(4, n | 0));
    var d = STAGES[n];
    if (!wall || !card) return;
    wall.setAttribute('data-stage', n);
    $$('.w-layer[data-min]', wall).forEach(function (l) { l.classList.toggle('on', +l.getAttribute('data-min') <= n); });
    if (from !== 'init' && !still) { wall.classList.remove('is-sweeping'); void wall.getBoundingClientRect(); wall.classList.add('is-sweeping'); }
    if (range && from !== 'range') range.value = n;
    if (range) range.setAttribute('aria-valuetext', 'Stage ' + (n + 1) + ': ' + d.name.toLowerCase());
    $$('.stage-step').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-go') === n)); });
    $('[data-st="no"]').textContent = 'Stage ' + (n + 1);
    $('[data-st="name"]').textContent = d.name;
    $('[data-st="fix"]').textContent = d.fix;
    $('[data-st="skip"]').textContent = d.skip;
    $('[data-st="tag"]').textContent = 'Stage ' + (n + 1) + ' \u00b7 ' + d.name;
    if (from !== 'init') { card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap'); }
  }
  if (range) range.addEventListener('input', function () { setStage(+range.value, 'range'); });
  $$('.stage-step').forEach(function (b) { b.addEventListener('click', function () { setStage(+b.getAttribute('data-go')); }); });
  if (wall) setStage(0, 'init');

  /* 2. Finish tabs */
  var tabs = $$('.chip-tab');
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t, p = document.getElementById(x.getAttribute('aria-controls'));
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      if (p) { p.hidden = !on; if (on) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); } }
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = k === 'ArrowRight' || k === 'ArrowDown' ? i + 1 : k === 'ArrowLeft' || k === 'ArrowUp' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault(); selectTab(tabs[(j + tabs.length) % tabs.length], true);
    });
  });

  /* 3. Before you paint */
  var boards = $$('.board'), tally = $('[data-prep-tally]'), dots = $$('.prep-dots i');
  function count() {
    var n = boards.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    dots.forEach(function (d, i) { d.classList.toggle('on', i < n); });
    if (tally) tally.textContent = n === 0 ? 'Tap the problems you\u2019ve spotted.'
      : n === 1 ? 'One to fix before painting.'
      : n + ' to fix before painting. Worth a skim coat conversation.';
  }
  boards.forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); count(); });
  });
})();
