/* All Seasons Exteriors: the sky follows the season of each section, the season wheel, service tabs and the storm shot list */
(function () {
  var root = document.documentElement;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* the page moves through the seasons: header glyph + label follow the section on screen */
  var secs = $$('main [data-season]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) root.setAttribute('data-season', e.target.getAttribute('data-season')); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* season wheel */
  var S = {
    spring: { tag: 'Spring \u00b7 hail & storms', h: 'Spring', img: 'own-blue-tarps', w: 1200, h2: 1600,
      alt: 'A house roof covered in blue tarps held down with wood battens, tall trees and a cloudy sky behind',
      cap: 'Their job: a roof dried in under blue tarps after a storm.',
      roof: 'Hail knocks the granules off shingles and can crack or bruise them; wind-driven rain then finds any lifted edge.',
      fence: 'Storm gusts push on a privacy fence like a sail. Leaning sections and loose pickets show up after spring storms.',
      list: ['Dents on gutters, vents and the A/C unit: hail marks show there first', 'Shingle grit piled up where the downspouts empty', 'Missing or lifted shingles, seen from the street'] },
    summer: { tag: 'Summer \u00b7 heat', h: 'Summer', img: 'own-reroof-crew', w: 1200, h2: 1340,
      alt: 'A roofing crew laying underlayment on a brick house under a clear blue sky, a yellow van parked in front',
      cap: 'Their job: a crew re-roofing a brick house in the summer sun.',
      roof: 'Long, hot days bake the shingles and the attic under them. Older shingles curl, crack and shed granules faster.',
      fence: 'Sun dries cedar out and turns it grey; boards shrink, gaps open and the ends start to split.',
      list: ['Shingle edges curling up or cupping', 'Dark, bare patches where the granules are gone', 'Fence boards gone grey, split or pulled away'] },
    autumn: { tag: 'Autumn \u00b7 wind', h: 'Autumn', img: 'own-cedar-fence', w: 1600, h2: 1020,
      alt: 'A new board-on-board cedar privacy fence with a cap rail along a sidewalk under a deep blue sky',
      cap: 'Their job: a new cedar privacy fence along a sidewalk.',
      roof: 'Strong gusts lift shingle tabs and break their seal; leaves and branches fill the valleys and gutters.',
      fence: 'Wind loads a solid privacy fence hard. Posts start to lean and rails pull loose from them.',
      list: ['Fence lines that lean, or posts that move when you push them', 'Shingles missing along the ridges and edges', 'Gutters full of leaves and spilling over in the rain'] },
    winter: { tag: 'Winter \u00b7 ice', h: 'Winter', img: 'stock-drip', w: 1600, h2: 1067,
      alt: 'Water dripping off the edge of a dark roof against a pale sky',
      cap: 'Meltwater at the roof edge (illustrative stock photo).',
      roof: 'Ice storms load the roof and gutters, and meltwater that refreezes at the eaves can back up under the shingles.',
      fence: 'Wet, frozen ground lets posts heave, and ice-heavy branches come down on fence lines.',
      list: ['Icicles or ridges of ice along the eaves', 'Gutters sagging or pulled away from the fascia', 'Water stains on ceilings near outside walls (check inside too)'] }
  };
  var card = document.querySelector('.as-sea-card');
  if (card) {
    var img = document.getElementById('sea-img'), cap = document.getElementById('sea-cap');
    var tag = document.getElementById('sea-tag'), h3 = document.getElementById('sea-h3');
    var roof = document.getElementById('sea-roof'), fence = document.getElementById('sea-fence'), list = document.getElementById('sea-list');
    $$('.as-q').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-s'), d = S[k];
        $$('.as-q').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        card.setAttribute('data-s', k);
        img.classList.add('swap');
        setTimeout(function () {
          img.src = 'images/' + d.img + '.jpg';
          img.srcset = 'images/' + d.img + '-720.jpg 720w, images/' + d.img + '.jpg ' + d.w + 'w';
          img.width = d.w; img.height = d.h2; img.alt = d.alt;
          img.classList.remove('swap');
        }, 170);
        cap.textContent = d.cap; tag.textContent = d.tag; h3.textContent = d.h; roof.textContent = d.roof; fence.textContent = d.fence;
        list.innerHTML = '';
        d.list.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; list.appendChild(li); });
      });
    });
  }

  /* Roof / Fence / Remodel */
  var tabs = $$('.as-tab');
  function show(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  $$('[data-need]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('.as-need input[value="' + a.getAttribute('data-need') + '"]');
      if (r) r.checked = true;
    });
  });

  /* after a storm: shots taken */
  var boxes = $$('.as-shot input'), n = document.getElementById('shot-n');
  boxes.forEach(function (b) {
    b.addEventListener('change', function () { if (n) n.textContent = boxes.filter(function (x) { return x.checked; }).length; });
  });
})();
