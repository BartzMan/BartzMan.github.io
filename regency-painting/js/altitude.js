(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* elevation gauge */
  var gn = $('#gauge-n');
  function gauge() {
    var s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kit-scroll')) || 0;
    var el = Math.round((5435 + s * 6800) / 5) * 5;
    gn.textContent = 'EL. ' + el.toLocaleString('en-US') + ' FT';
  }
  window.addEventListener('scroll', gauge, { passive: true }); gauge();

  /* spot positioning (viewBox fixed) */
  function place(box, vb) {
    $$('[data-x]', box).forEach(function (s) {
      s.style.left = (+s.getAttribute('data-x') / vb[0] * 100) + '%';
      s.style.top = (+s.getAttribute('data-y') / vb[1] * 100) + '%';
    });
  }
  place($('#kitbox'), [1000, 520]); place($('#trail'), [1000, 440]);

  /* tablists */
  function tablist(tabs, onSel) {
    function on(t, focus) {
      tabs.forEach(function (x) {
        var sel = x === t; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !sel;
      });
      if (focus) t.focus(); if (onSel) onSel(t);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { on(t); });
      t.addEventListener('keydown', function (e) {
        var n = null, k = e.key;
        if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); on(n, true); }
      });
    });
    return on;
  }
  var viewOn = tablist($$('.view-tabs [role=tab]'));
  tablist($$('.svc-tabs [role=tab]'));
  var go = $('[data-goto="kit"]');
  if (go) go.addEventListener('click', function () { viewOn($('#v-kit')); });

  /* sun side / shade side */
  var T = {
    morning: { cls: 't-morning', lit: 'Lit now: the east wall', h: 'Morning: the east wall wakes up.',
      p: 'The low morning sun lights the east wall first. It is gentler than noon, but it warms doors and trim quickly, and cold nights followed by warm sun make materials expand and shrink every day.',
      ul: ['Trim and door edges that are cracking', 'Caulk lines that have split open', 'Paint that looks dull on one side only'],
      shade: 'the north wall is still in shadow and stays cool and damp, so watch for mildew and slow-drying paint there.' },
    noon: { cls: 't-noon', lit: 'Lit now: the south wall', h: 'Noon: the strongest dose.',
      p: 'With the sun high, the south wall and the roofline get the most direct light. In thin air, ultraviolet is strong, which is why colour fades and paint can chalk on the sunniest walls first.',
      ul: ['Fading or a chalky film when you rub the wall', 'Dried, greying wood trim', 'Caulk that has cracked or pulled away'],
      shade: 'the north wall stays cooler and damper, so watch for mildew and slow-drying paint there.' },
    afternoon: { cls: 't-afternoon', lit: 'Lit now: the west wall', h: 'Afternoon: the hot side.',
      p: 'Late sun is low and hard, and it hits the west wall head on, often after a long day of heat. Paint and stain on this side can blister, peel or dry out faster than anywhere else.',
      ul: ['Bubbling or peeling paint', 'Stain on decks and doors that has gone grey', 'Gaps opening where trim meets siding'],
      shade: 'the east wall is cooling off and the north wall has stayed shaded all day.' }
  };
  var walls = $('#walls');
  $$('.time-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = T[b.getAttribute('data-t')];
      $$('.time-tabs button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      walls.setAttribute('class', 'walls ' + d.cls);
      $('#sc-lit').textContent = d.lit; $('#sc-h').textContent = d.h; $('#sc-p').textContent = d.p;
      $('#sc-ul').innerHTML = d.ul.map(function (t) { return '<li>' + t + '</li>'; }).join('');
      $('#vp-house .sc-shade').innerHTML = '<b>Shade side:</b> ' + d.shade;
      var c = $('#vp-house .sun-card'); c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
    });
  });

  /* kitchen cabinet process */
  var S = [
    ['Clean and degrease.', 'Kitchen cabinets collect grease and fingerprints, and paint will not hold to a dirty surface. Everything is cleaned before anything else happens.', 'cabinet paint takes daily wear, so the prep decides how long it lasts.'],
    ['Scuff sand and fill.', 'A light sanding gives the primer something to grip. Dents and old hardware holes are filled and smoothed flat.', 'a smooth surface shows through every coat that follows.'],
    ['Prime.', 'A bonding primer helps new colour stick to an old finish and keeps stains and wood tannins from showing through.', 'skipping primer is the usual reason cabinet paint chips.'],
    ['Paint in thin coats.', 'Two or more thin coats look smoother and cure harder than one thick coat, with light sanding between them.', 'thin coats avoid drips and brush marks on door edges.'],
    ['Cure, then rehang.', 'Paint can feel dry long before it is hard. Doors and hardware go back once the finish has cured, so it does not mark or stick.', 'patience here is what keeps the finish from tacking and chipping.']
  ];
  function step(i) {
    $$('[data-step]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-step') === i)); });
    $('#kc-no').textContent = 'Step ' + (i + 1) + ' of 5'; $('#kc-h').textContent = S[i][0]; $('#kc-p').textContent = S[i][1];
    $('#vp-kit .sc-shade').innerHTML = '<b>Why it matters:</b> ' + S[i][2];
    var c = $('#vp-kit .sun-card'); c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
  }
  $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { step(+b.getAttribute('data-step')); }); });

  /* spring check trail */
  var W = [
    ['Peeling on the south and west sides.', 'These walls get the most sun, so they are where a paint film gives up first. Look for lifting, flaking or bubbling paint, especially near the bottom of the siding.'],
    ['Cracked caulk.', 'Caulk seals the joints around windows, doors and trim. Look for lines that have split, shrunk or pulled away, since gaps let water behind the paint.'],
    ['Bare wood at the sills.', 'Window sills and ledges catch the most sun and water. Grey, rough or bare wood means the paint has worn through and the wood needs protecting.'],
    ['Faded trim.', 'Compare trim on the sunny side with trim in the shade. A big difference in colour is a sign the finish is wearing thin.'],
    ['Hail chips on siding.', 'After a hail season, look from the ground for small dents or chipped paint on siding, gutters and trim. Chips let moisture into the surface.']
  ];
  var seen = {};
  $$('.wp').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-i'); seen[i] = 1;
      $$('.wp').forEach(function (x) { x.classList.toggle('on', x === b); });
      b.setAttribute('aria-pressed', 'true');
      $('#tc-no').textContent = 'Marker ' + (i + 1) + ' of 5'; $('#tc-h').textContent = W[i][0]; $('#tc-p').textContent = W[i][1];
      var n = Object.keys(seen).length;
      $('#tc-meter').innerHTML = '<b>' + n + ' of 5</b> markers visited' + (n === 5 ? '. You have walked the whole trail.' : '');
    });
  });

  /* gallery filter */
  var chips = $$('.gal-chips button'), items = $$('.gi');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      items.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-tag') === f); });
    });
  });
})();
