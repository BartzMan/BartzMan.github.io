/* Weber Air: the duct-run interactions (cooling/heating mode, the house section, the hot-room checklist) */
(function () {
  var root = document.documentElement;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Cooling / Heating: re-colours the accents and swaps the season copy and photo */
  var sys = document.getElementById('form-system'), sysTouched = false;
  if (sys) sys.addEventListener('change', function () { sysTouched = true; });
  function setMode(m) {
    root.setAttribute('data-mode', m);
    $$('[data-mode-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-set') === m)); });
    if (sys && !sysTouched) sys.value = m === 'heat' ? 'Heating' : 'Cooling';
  }
  $$('[data-mode-set]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode-set')); }); });
  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { if (sys) { sys.value = a.getAttribute('data-pick'); sysTouched = true; } }); });

  /* Where does your air go? */
  var FAULTS = {
    crushed: ['Crushed flex duct', 'A run that\u2019s kinked, sagging or squashed under storage chokes the air, so the room never reaches the set temperature.'],
    boot: ['Loose boot', 'The boot joins the duct to the ceiling register. If it pulls loose, cooled or heated air spills into the attic instead of the room.'],
    filter: ['Clogged filter', 'A dirty filter cuts airflow to every run at once, and the rooms at the far ends feel it first.'],
    ret: ['Undersized return', 'If air can\u2019t get back to the unit easily, less comes out of the registers, and rooms with the door shut feel it most.']
  };
  var ROOMS = {
    bed: { name: 'Upstairs bedroom', img: 'stock-empty-room', w: 1600, h: 1064, alt: 'An empty room with grey walls, a window and a wood-look floor',
      run: 'Fed straight down from the attic: a short run, but the duct sits in the hottest air in the house all summer.', faults: ['boot', 'filter'] },
    game: { name: 'Game room', img: 'stock-ceiling-fan-living', w: 1200, h: 1200, alt: 'An open room with a ceiling fan, a staircase and a wood-look floor',
      run: 'A short hop from the unit, next to the hallway return. Big open rooms depend on that return pulling its share.', faults: ['ret', 'filter'] },
    bonus: { name: 'Bonus room over the garage', img: 'stock-room', w: 1600, h: 2400, alt: 'A bright vaulted room with a wood beam, ceiling registers, a sofa and two armchairs',
      run: 'The longest run in the house, over a garage that is neither heated nor cooled. If one room is always the hot one, it\u2019s usually this one.', faults: ['crushed', 'ret'] },
    living: { name: 'Living room', img: 'stock-livingroom', w: 1600, h: 1067, alt: 'A bright living room with a beige sofa, an armchair and large windows',
      run: 'Fed down a wall chase from the attic, so the duct makes two bends before it reaches the ceiling register downstairs.', faults: ['crushed', 'boot'] },
    kitchen: { name: 'Kitchen', img: 'stock-kitchen', w: 1600, h: 1067, alt: 'A white kitchen with a marble island, bar stools and pendant lights',
      run: 'Down the second chase. Cooking adds heat to the room, so this register works hardest around dinner time.', faults: ['boot', 'filter'] }
  };
  var img = document.getElementById('room-img');
  var nameEl = document.getElementById('room-name'), runEl = document.getElementById('room-run'), fEl = document.getElementById('room-faults');
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function pick(key, focus) {
    var r = ROOMS[key];
    if (!r || !img) return;
    $$('.room-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-room') === key)); });
    $$('.runs-air path, .regs rect').forEach(function (p) {
      var on = p.getAttribute('data-air') === key || p.getAttribute('data-reg') === key;
      p.classList.toggle('on', on);
    });
    img.classList.add('swap');
    setTimeout(function () {
      img.src = 'images/' + r.img + '.jpg';
      img.srcset = 'images/' + r.img + '-720.jpg 720w, images/' + r.img + '.jpg ' + r.w + 'w';
      img.width = r.w; img.height = r.h; img.alt = r.alt;
      img.classList.remove('swap');
    }, 180);
    nameEl.textContent = r.name;
    runEl.textContent = r.run;
    fEl.innerHTML = r.faults.map(function (f) { return '<li><b>' + esc(FAULTS[f][0]) + '</b>' + esc(FAULTS[f][1]) + '</li>'; }).join('');
  }
  $$('.room-btn').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-room')); }); });
  pick('bonus');

  /* Texas summer: why one room is always hot */
  var items = $$('.hot-item');
  var count = document.getElementById('hot-count');
  var slots = $$('.meter-grille i');
  items.forEach(function (it) {
    var q = it.querySelector('.hot-q'), a = it.querySelector('.hot-a'), box = it.querySelector('input');
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', String(open));
      a.hidden = !open;
    });
    box.addEventListener('change', function () { it.classList.toggle('done', box.checked); tally(); });
  });
  function tally() {
    var n = items.filter(function (it) { return it.querySelector('input').checked; }).length;
    if (count) count.textContent = n + ' of 5';
    slots.forEach(function (s, i) { s.classList.toggle('on', i < n); });
  }
})();
