(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* tape peels back once per section, the first time it comes into view */
  var tapes = $$('.tape-peel');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; io.unobserve(t);
        setTimeout(function () { t.classList.add('peeled'); setTimeout(function () { t.classList.add('gone'); }, 1600); }, 350);
      });
    }, { threshold: 0.9, rootMargin: '0px 0px -8% 0px' });
    tapes.forEach(function (t) { io.observe(t); });
  } else { tapes.forEach(function (t) { t.classList.add('gone'); }); }

  /* interior / exterior tabs */
  var tabs = $$('.tabs [role=tab]');
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); pick(n); }
    });
  });
  function pick(b) {
    tabs.forEach(function (t) {
      var on = t === b; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on; p.classList.toggle('on', on);
      if (on) $$('[data-reveal]', p).forEach(function (el) { el.classList.add('kit-in'); });
    });
  }

  /* room by room prep */
  var rooms = {
    kitchen: { t: 'Kitchen', img: 'kitchen.jpg', alt: 'Bright kitchen with a white island and pendant lights',
      sub: 'Kitchens collect grease and steam, and paint will not grip a greasy wall.',
      steps: ['<b>Degrease</b> walls and cabinet faces, then rinse and let them dry.', '<b>Patch</b> nail holes and dents, then sand the patches flush.', '<b>Caulk</b> the seams where backsplash, trim and wall meet.', '<b>Prime</b> stained, glossy or bare spots so the colour sits evenly.', '<b>Mask</b> counters, appliances and the edge of the tile with tape.'],
      watch: 'Cooking film left on a wall shows up later as peeling or patchy paint.' },
    bedroom: { t: 'Bedroom', img: 'empty-room.jpg', alt: 'Empty room with grey walls, white trim and a window',
      sub: 'Bedrooms are calm rooms, so the walls should look flat and even in every light.',
      steps: ['<b>Clear</b> and cover the floor and furniture with drop cloths.', '<b>Fill</b> nail holes and hairline cracks, then sand them smooth.', '<b>Spot-prime</b> the patches so they do not show through the colour.', '<b>Tape</b> the ceiling line, window trim and baseboards.', '<b>Roll</b> in even strokes, then peel the tape while the paint is still soft.'],
      watch: 'Patches that skip primer can look like pale blotches once the colour is dry.' },
    bath: { t: 'Bathroom', img: 'bath.jpg', alt: 'Bathroom with a grey double vanity and mirrors',
      sub: 'Showers and Gulf humidity mean moisture is the main enemy of bathroom paint.',
      steps: ['<b>Dry out</b> the room: run the fan and open a window before any work.', '<b>Scrub</b> mildew spots with a cleaner, rinse and let the wall dry fully.', '<b>Caulk</b> the gaps around the tub, vanity and window.', '<b>Prime</b> with a moisture and mildew resistant primer.', '<b>Choose a sheen</b> that wipes clean, then tape off fixtures and tile.'],
      watch: 'Painting over damp or mildewy walls traps the problem under the paint.' },
    living: { t: 'Living room', img: 'living.jpg', alt: 'Large living room with armchairs, tall windows and a fireplace',
      sub: 'The biggest walls in the house show every bump and roller mark, especially in strong window light.',
      steps: ['<b>Remove</b> switch plates and outlet covers, or tape them over.', '<b>Patch and sand</b> the wall, then wipe off the dust.', '<b>Caulk</b> where trim meets the wall so the lines look crisp.', '<b>Tape</b> trim, windows and the ceiling edge.', '<b>Check the light</b> at different times of day before the second coat.'],
      watch: 'Side light from big windows shows uneven patches that a lamp would hide.' },
    exterior: { t: 'Exterior siding', img: 'brick-home.jpg', alt: 'Two-storey brick home on a street with bare trees',
      sub: 'Outside, the weather decides the schedule, and Houston humidity decides how long the surface needs to dry.',
      steps: ['<b>Wash</b> the siding to lift dirt, chalk and mildew, then rinse.', '<b>Dry</b> it fully. Damp wood and siding are not ready for paint.', '<b>Scrape and sand</b> any peeling edges so the new coat has a firm base.', '<b>Caulk</b> gaps at trim, corners and windows, and prime bare wood.', '<b>Mask</b> windows, lights and fixtures, and paint on a dry day.'],
      watch: 'Paint applied to a damp surface can blister or peel much sooner.' },
    trim: { t: 'Trim & doors', img: 'taped-room.jpg', alt: 'White door frame with yellow tape along the edge of a wall',
      sub: 'Trim and doors are touched, bumped and wiped the most, so smoothness matters more than speed.',
      steps: ['<b>Take off</b> hardware, or mask the knobs and hinges.', '<b>Clean and scuff-sand</b> glossy surfaces so paint can grip.', '<b>Fill</b> dings and caulk the seams between trim and wall.', '<b>Prime</b> bare spots, then <b>tape</b> the wall side of every edge.', '<b>Brush</b> in thin coats, letting each one dry before the next.'],
      watch: 'Thick coats on trim run, sag and stay tacky; thin coats finish harder.' }
  };
  var svgRooms = $$('.room'), chips = $$('.plan-chips button');
  function room(k) {
    var d = rooms[k]; if (!d) return;
    svgRooms.forEach(function (g) { g.setAttribute('aria-pressed', g.id === 'r-' + k); });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-room') === k); });
    var im = $('#prep-img'); im.style.opacity = 0;
    setTimeout(function () { im.src = 'images/' + d.img; im.alt = d.alt; im.style.opacity = 1; }, 160);
    $('#prep-title').textContent = d.t; $('#prep-sub').textContent = d.sub;
    var ol = $('#prep-steps'); ol.innerHTML = '';
    d.steps.forEach(function (s) { var li = document.createElement('li'); li.innerHTML = s; ol.appendChild(li); });
    $('#prep-watch').textContent = d.watch;
  }
  svgRooms.forEach(function (g) {
    var k = g.id.replace('r-', '');
    g.addEventListener('click', function () { room(k); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); room(k); } });
  });
  chips.forEach(function (c) { c.addEventListener('click', function () { room(c.getAttribute('data-room')); }); });
  room('kitchen');

  /* humidity tips */
  var tips = [
    ['Dry days for the outside', 'Paint and primer need a dry surface and settled weather. Check the forecast for a few clear days before outdoor work starts.'],
    ['Wash it, then let it dry', 'Dirt and chalky residue keep paint from gripping. Wash the surface, rinse it, then wait until it is completely dry.'],
    ['Prime bare wood', 'Bare or freshly patched spots soak up paint unevenly. Primer seals them first so the colour sits even and lasts.'],
    ['Treat mildew first', 'Painting over mildew only hides it for a while. Clean it off with a mildew cleaner and let the area dry before any coat.'],
    ['The right sheen for the room', 'Bathrooms and kitchens do better with a finish that wipes clean. Flatter paint hides flaws on ceilings and big walls.']
  ];
  var tabsC = $$('.chip'), seen = {}, cur = 0;
  function tip(i, user) {
    cur = i; seen[i] = true;
    tabsC.forEach(function (c, j) { c.setAttribute('aria-selected', j === i); c.tabIndex = j === i ? 0 : -1; c.classList.toggle('done', !!seen[j]); });
    $('#care-big').textContent = i + 1; $('#care-h').textContent = tips[i][0]; $('#care-p').textContent = tips[i][1];
    var n = Object.keys(seen).length;
    $('#care-fill').style.width = (n / 5 * 100) + '%'; $('#care-count').textContent = n + ' of 5 read';
    $('#care-next').textContent = n === 5 && i === 4 ? 'Back to tip 1' : 'Next tip';
    if (user) tabsC[i].focus({ preventScroll: true });
  }
  tabsC.forEach(function (c, i) {
    c.addEventListener('click', function () { tip(i); });
    c.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); tip((i + (e.key === 'ArrowDown' ? 1 : 4)) % 5, true); } });
  });
  $('#care-next').addEventListener('click', function () { tip((cur + 1) % 5); });
  tip(0);
})();
