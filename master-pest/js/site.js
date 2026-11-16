(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- chameleon: header and accent take the colour of the section on screen ---- */
  var TONES = {
    hero:     ['#123D22', '#F1E9DA', '#B7D94C', '#123D22'],
    guide:    ['#F1E9DA', '#14301B', '#3FA34D', '#F1E9DA'],
    house:    ['#256B91', '#F4FAFD', '#8AD1F0', '#256B91'],
    services: ['#6B4A2E', '#F6EBDD', '#E8C592', '#6B4A2E'],
    useful:   ['#B7D94C', '#14301B', '#14301B', '#B7D94C'],
    banner:   ['#0E2615', '#F1E9DA', '#B7D94C', '#0E2615'],
    yards:    ['#17401F', '#F1E9DA', '#B7D94C', '#17401F'],
    contact:  ['#F1E9DA', '#14301B', '#3FA34D', '#F1E9DA']
  };
  function setTone(name) {
    var t = TONES[name]; if (!t) return;
    root.style.setProperty('--tb', t[0]);
    root.style.setProperty('--ti', t[1]);
    root.style.setProperty('--ta', t[2]);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t[3]);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setTone(e.target.getAttribute('data-tone')); });
    }, { rootMargin: '-8% 0px -88% 0px' });
    $$('[data-tone]').forEach(function (s) { io.observe(s); });
  }

  /* ---- hero chameleon eye follows the pointer ---- */
  var pupil = $('.mp-pupil');
  if (pupil && !still) {
    document.addEventListener('pointermove', function (e) {
      var r = pupil.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(3, d / 60);
      pupil.style.transform = 'translate(' + (dx / d * k).toFixed(2) + 'px,' + (dy / d * k).toFixed(2) + 'px)';
    }, { passive: true });
  }

  function jump(id) {
    var el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    el.classList.add('is-flash'); setTimeout(function () { el.classList.remove('is-flash'); }, 1500);
  }

  /* ---- 1. field guide ---- */
  var SVC = {
    h: ['General household pest control', 'svc-household'],
    r: ['Rodent control', 'svc-rodent'],
    l: ['Lawn and ornamental pest control', 'svc-lawn'],
    t: ['Termite and wood-destroying organism control', 'svc-termite']
  };
  function svcLink(k) { return '<a href="#' + SVC[k][1] + '" data-jump="' + SVC[k][1] + '">' + SVC[k][0] + '</a>'; }
  var GUIDE = [
    { where: 'Kitchens and pantries, along baseboards, around sinks, and in the yard as small soil mounds at the edge of paving.', signs: 'A steady trail of ants to a crumb or spill, or tiny hills of loose soil in the lawn.', svc: svcLink('h') + ' (indoor trails) and ' + svcLink('l') + ' (outdoor mounds)' },
    { where: 'Kitchens, bathrooms, garages and utility rooms, under sinks and near drains. Warm, damp, dark corners.', signs: 'Specks like coffee grounds along edges, a musty smell, or insects scattering when the light goes on at night.', svc: svcLink('h') },
    { where: 'Garage corners, eaves, lanai ceilings and screens, behind outdoor furniture and in sheds.', signs: 'New webs in corners and across door frames, or small silk egg sacs tucked into quiet spots.', svc: svcLink('h') },
    { where: 'Attics, garages, behind appliances, in wall voids and along the roofline. They follow warmth and food.', signs: 'Droppings, gnaw marks on boxes or wiring covers, greasy rub marks on baseboards, scratching at night.', svc: svcLink('r') },
    { where: 'St. Augustine lawns, especially sunny, hot patches beside the driveway, sidewalk or street.', signs: 'Yellow-brown patches that spread and do not green up after watering.', svc: svcLink('l') + '. Try the <a href="#lawn-check">4-step lawn check</a>.' },
    { where: 'Lawns and planting beds, in loose, sandy soil, often near irrigation.', signs: 'Raised, spongy tunnels in the turf, and brown patches that lift away from the soil easily.', svc: svcLink('l') },
    { where: 'In and around soil and anything wooden that touches the ground: foundations, fence posts, stumps and slab edges.', signs: 'Pencil-width mud tubes on walls or piers, discarded wings by windows, wood that sounds hollow when tapped.', svc: svcLink('t') },
    { where: 'Attic framing, door and window frames, trim and wooden furniture, inside the wood itself.', signs: 'Tiny pellets like coarse sand piling under a piece of wood, and discarded wings on sills.', svc: svcLink('t') }
  ];
  var plates = $$('.mp-plate'), entry = $('#entry');
  function showPlate(i) {
    var g = GUIDE[i], p = plates[i];
    plates.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    $('#entry-no').textContent = $('.mp-plate-no', p).textContent;
    $('#entry-name').textContent = $('.mp-plate-name', p).textContent;
    $('#entry-latin').textContent = $('.mp-plate-latin', p).textContent;
    $('#entry-where').textContent = g.where;
    $('#entry-signs').textContent = g.signs;
    $('#entry-svc').innerHTML = g.svc;
    var art = $('#entry-art'); art.innerHTML = '';
    art.appendChild($('svg', p).cloneNode(true));
    entry.classList.remove('is-swap'); void entry.offsetWidth; entry.classList.add('is-swap');
  }
  plates.forEach(function (b, i) { b.addEventListener('click', function () { showPlate(i); if (window.innerWidth < 900) entry.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'nearest' }); }); });
  if (plates.length) showPlate(0);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-jump]');
    if (a) { e.preventDefault(); jump(a.getAttribute('data-jump')); }
  });

  /* ---- 2. around the house ---- */
  var SPOTS = [
    { t: 'Yard and outside walls', img: 'images/stock-house-720.jpg', alt: 'Brick house with trees and a green lawn under blue sky', cap: 'Illustrative photo',
      text: 'Most visitors start outdoors. Mulch, leaf litter and shrubs touching the wall make easy cover and an easy way in.',
      look: ['Mulch or plants pressed against the walls', 'Gaps around pipes, vents and door sweeps', 'Soil mounds along paving or the slab edge'], svc: ['h', 'l'] },
    { t: 'The lawn', img: 'images/stock-yard-fence-720.jpg', alt: 'Backyard with a wooden fence, green lawn and a tree', cap: 'Illustrative photo',
      text: 'Florida grass takes a lot of punishment. Pests in the turf show up as patches, not bugs, so look at the shape of the damage.',
      look: ['Yellow-brown patches in full sun', 'Spongy, tunnelled turf', 'Grass that stays thin after watering'], svc: ['l'] },
    { t: 'The lanai', img: 'images/stock-lanai-720.jpg', alt: 'Open living area with a ceiling fan looking out to a screened porch', cap: 'Illustrative photo',
      text: 'Screens, lights and shade make the lanai a favourite for spiders and the insects they follow.',
      look: ['Webs along screen frames and ceiling corners', 'Insects gathering around lights', 'Dark corners behind furniture and storage'], svc: ['h'] },
    { t: 'The kitchen', img: 'images/stock-kitchen-2-720.jpg', alt: 'Kitchen with white cabinets, a counter and pendant lights', cap: 'Illustrative photo',
      text: 'Food, water and warmth in one room. Ants and roaches head here first, usually after dark.',
      look: ['Trails along counters and baseboards', 'Specks beneath the sink or behind appliances', 'Crumbs and spills left overnight'], svc: ['h'] },
    { t: 'Attic and wood', img: 'images/stock-attic-vent-720.jpg', alt: 'Roof vent on the side of a brick building under a grey sky', cap: 'Illustrative photo',
      text: 'Quiet and out of sight, so rodents and wood-eating insects get a head start. Listen for noise and check the timber.',
      look: ['Scratching in the ceiling at night', 'Droppings or chewed insulation', 'Pellets or mud tubes on or under wood'], svc: ['r', 't'] }
  ];
  var spots = $$('.mp-spot'), chips = $$('.mp-chip');
  function showSpot(i) {
    var s = SPOTS[i];
    spots.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-spot') == i ? 'true' : 'false'); });
    chips.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-spot') == i ? 'true' : 'false'); });
    var img = $('#spot-img'); img.src = s.img; img.alt = s.alt; img.removeAttribute('loading');
    $('#spot-cap').textContent = s.cap;
    $('#spot-no').textContent = 'Spot ' + (i + 1) + ' of 5';
    $('#spot-title').textContent = s.t;
    $('#spot-text').textContent = s.text;
    $('#spot-look').innerHTML = s.look.map(function (l) { return '<li>' + l + '</li>'; }).join('');
    $('#spot-svc').innerHTML = '<span>Points to</span>' + s.svc.map(function (k) { return '<a href="#' + SVC[k][1] + '" data-jump="' + SVC[k][1] + '">' + SVC[k][0] + '</a>'; }).join('');
  }
  spots.concat(chips).forEach(function (b) { b.addEventListener('click', function () { showSpot(+b.getAttribute('data-spot')); }); });
  if (spots.length) showSpot(0);

  /* ---- 3. lawn check stepper ---- */
  var CAP = ['Step 1: a patch of yellow in the sun.', 'Step 2: the edge, where yellow meets green.', 'Step 3: part the grass down to the soil.', 'Step 4: tiny black bugs with white wings? Call us.'];
  var steps = $$('.mp-step'), scene = $('#scene');
  steps.forEach(function (b) {
    b.addEventListener('click', function () {
      var n = +b.getAttribute('data-s');
      steps.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      scene.setAttribute('data-step', n); $('#scene-cap').textContent = CAP[n - 1];
    });
  });
})();
