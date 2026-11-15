/* Oscar's Pro Painting: room by room, service tabs, spray/brush + prep strips, sheen picker */
(function () {
  var q = function (s, el) { return (el || document).querySelector(s); };
  var qa = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function replay(el, cls) { if (calm) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ---------- room by room ---------- */
  var SURF = {
    walls: { n: '01', t: 'Walls', sw: '#6E7880', p: 'Rolled for even coverage, with the edges cut in by brush where they meet the ceiling and trim.',
      prep: ['clean', 'fill', 'prime'], m: ['rolled', 'brushed'],
      img: 'images/stock-roller-4-720.jpg', w: 720, h: 540, alt: 'A paint roller rolling white paint onto a wall', cap: 'Illustrative stock photo: rolling a wall.' },
    ceiling: { n: '02', t: 'Ceilings', sw: '#F2F0EA', p: 'Usually a flat finish, rolled, so light skims across it without picking out every bump.',
      prep: ['clean', 'fill'], m: ['rolled'],
      img: 'images/stock-empty-room-720.jpg', w: 720, h: 479, alt: 'An empty room with grey walls, white trim and a white ceiling', cap: 'Illustrative stock photo: grey walls, white ceiling and trim.' },
    trim: { n: '03', t: 'Trim, crown & surrounds', sw: '#FFFFFF', p: 'Trim gets the most knocks and the closest look, so every joint is caulked and it goes on in a harder sheen.',
      prep: ['clean', 'degloss', 'fill', 'caulk', 'prime'], m: ['brushed', 'sprayed'],
      img: 'images/own-fireplace-wall-720.jpg', w: 720, h: 960, alt: 'A tall grey wall with a white fireplace surround, panelled overmantel and crown moulding', cap: 'Oscar\u2019s job: white surround and crown on a two-storey grey wall.' },
    cabinets: { n: '04', t: 'Cabinets', sw: '#F7F5EF', p: 'Cabinets are degreased and given a bonding primer before the colour, then finished smooth.',
      prep: ['clean', 'degloss', 'fill', 'prime'], m: ['sprayed', 'brushed'],
      img: 'images/own-kitchen-finished-720.jpg', w: 720, h: 960, alt: 'A galley kitchen with freshly painted white cabinets', cap: 'Oscar\u2019s job, finished: a galley kitchen painted white.' },
    door: { n: '05', t: 'Doors & entries', sw: '#EAE5DA', p: 'Panel doors are painted in order, panels first, then rails and stiles, so no lap marks show.',
      prep: ['clean', 'degloss', 'fill', 'caulk', 'prime'], m: ['brushed', 'sprayed'],
      img: 'images/own-front-door-720.jpg', w: 720, h: 1168, alt: 'A white panelled front door with leaded-glass sidelights in a brick entry', cap: 'Oscar\u2019s job: a white front door and sidelights.' },
    accent: { n: '06', t: 'Accent wall', sw: '#2E2FA0', p: 'One wall in a deeper colour. The cut-in lines at the ceiling and corners make or break it.',
      prep: ['clean', 'fill', 'prime'], m: ['rolled', 'brushed'],
      img: 'images/stock-roller-blue-720.jpg', w: 720, h: 503, alt: 'A roller laying blue paint onto a white wall', cap: 'Illustrative stock photo: rolling a deeper colour.' }
  };
  var room = q('.ci-room'), job = q('.ci-job');
  if (room && job) {
    var groups = qa('.ci-surf', room), chips = qa('.ci-surf-chip');
    var img = q('.ci-job-img', job);
    function pick(key, user) {
      var d = SURF[key]; if (!d) return;
      room.classList.toggle('has-pick', !!user);
      groups.forEach(function (g) { var on = g.getAttribute('data-surf') === key; g.classList.toggle('on', on && !!user); g.setAttribute('aria-pressed', String(on)); });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-surf') === key)); });
      img.src = d.img; img.width = d.w; img.height = d.h; img.alt = d.alt;
      q('.ci-job-cap', job).textContent = d.cap;
      q('.ci-job-tag', job).textContent = 'Surface ' + d.n;
      q('.ci-job-sw', job).style.setProperty('--sw', d.sw);
      q('.ci-job-t', job).textContent = d.t;
      q('.ci-job-p', job).textContent = d.p;
      qa('.ci-prep li', job).forEach(function (li) { li.classList.toggle('on', d.prep.indexOf(li.getAttribute('data-step')) > -1); });
      qa('.ci-method li', job).forEach(function (li) { li.classList.toggle('on', d.m.indexOf(li.getAttribute('data-m')) > -1); });
      if (user) replay(job, 'ci-swap');
    }
    groups.forEach(function (g) {
      var key = g.getAttribute('data-surf');
      g.addEventListener('click', function () { pick(key, true); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(key, true); } });
    });
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-surf'), true); }); });
    pick('walls', false);
  }

  /* ---------- tab sets (services, spray/brush) ---------- */
  qa('[role="tablist"]').forEach(function (list) {
    var tabs = qa('[role="tab"]', list);
    function go(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t, p = document.getElementById(x.getAttribute('aria-controls'));
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        if (p) { p.hidden = !on; if (on) replay(p, 'ci-show'); }
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); }
      });
    });
  });

  /* ---------- prep strips ---------- */
  var strips = qa('.ci-strip'), count = q('.ci-prep-count b');
  strips.forEach(function (s) {
    s.addEventListener('click', function () {
      s.setAttribute('aria-pressed', String(s.getAttribute('aria-pressed') !== 'true'));
      count.textContent = strips.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
    });
  });

  /* ---------- sheen picker ---------- */
  var SHEEN = {
    flat: { t: 'Flat', rooms: ['ceil'], where: 'Ceilings, and walls that don\u2019t get touched much.', why: 'No shine means light skims across without showing bumps and patches. It\u2019s the hardest to scrub.' },
    eggshell: { t: 'Eggshell', rooms: ['living', 'bed'], where: 'Living rooms, bedrooms and dining rooms.', why: 'A soft glow that still hides small flaws, and wipes clean of fingerprints.' },
    satin: { t: 'Satin', rooms: ['kitchen', 'bath', 'hall'], where: 'Kitchens, bathrooms, hallways and kids\u2019 rooms.', why: 'Tougher and easier to scrub, and it shrugs off steam and splashes better than flatter paint.' },
    semigloss: { t: 'Semi-gloss', rooms: ['trim'], where: 'Trim, baseboards, doors and cabinets.', why: 'Hard and wipeable, so it suits the parts hands and shoes hit. It shows every flaw, so the prep underneath matters.' }
  };
  var dds = qa('.ci-dd'), house = q('.ci-house'), card = q('.ci-sheen-card');
  if (dds.length && house && card) {
    function sheen(key) {
      var d = SHEEN[key];
      dds.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-sheen') === key)); });
      qa('.ci-rm', house).forEach(function (r) { r.classList.toggle('on', d.rooms.indexOf(r.getAttribute('data-r')) > -1); });
      q('.ci-sheen-t', card).textContent = d.t;
      q('.ci-sheen-where span', card).textContent = d.where;
      q('.ci-sheen-why span', card).textContent = d.why;
      replay(card, 'ci-show');
    }
    dds.forEach(function (b) { b.addEventListener('click', function () { sheen(b.getAttribute('data-sheen')); }); });
    sheen('flat');
  }
})();
