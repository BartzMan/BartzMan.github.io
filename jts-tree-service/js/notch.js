(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* stars */
  var starPath = 'M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8z';
  $$('[data-stars]').forEach(function (el, n) {
    var r = parseFloat(el.getAttribute('data-stars')), h = '';
    for (var i = 0; i < 5; i++) {
      var f = Math.max(0, Math.min(1, r - i)), id = 'sg' + n + '-' + i;
      h += '<svg viewBox="0 0 24 24"><defs><linearGradient id="' + id + '"><stop offset="' + (f * 100) + '%" stop-color="#D9892B"/><stop offset="' + (f * 100) + '%" stop-color="#B7B2A6"/></linearGradient></defs><path d="' + starPath + '" fill="url(#' + id + ')"/></svg>';
    }
    el.innerHTML = h;
  });

  /* cut diagram */
  var JOBS = [
    { t: 'Tree trimming and limb removal', x: 'Taking off dead, overhanging or crowding limbs so the rest of the tree, and whatever is under it, stays clear.', w: 'Limbs hang over a roof, fence or driveway, or the crown has dead branches in it.', img: 'pine-sunset', alt: 'The crown of a lone pine against an orange sunset', cap: 'Illustrative photo: a pine crown', own: false },
    { t: 'Tree removal', x: 'Taking a whole tree down, in sections or in one piece, depending on what is growing around it.', w: 'The tree is dead, leaning, or too close to the house to keep.', img: 'own-trunk', alt: 'A single tall pine trunk beside a grey-sided house', cap: 'The business\'s own photo: a tall pine by a house', own: true },
    { t: 'Storm-damaged and fallen trees', x: 'Clearing a tree or big limb that a storm has brought down, or one that is left hanging and is no longer sound.', w: 'After wind, ice or lightning. If it touches a wire, keep clear and call.', img: 'fallen-yard', alt: 'A large tree that has fallen over in a yard with its roots in the air', cap: 'Illustrative photo: a fallen tree', own: false },
    { t: 'Log and debris cleanup', x: 'Cutting fallen trunks into rounds and clearing the logs, limbs and brush so the lot is usable again.', w: 'A tree is down and in pieces, or limbs and brush are stacking up.', img: 'own-logs', alt: 'Pine logs cut into rounds on a sawdust-covered lot beside a wooden stair', cap: 'The business\'s own photo: pine rounds on a lot', own: true }
  ];
  var btns = $$('.svc-btn'), hots = $$('.hot');
  function setJob(i) {
    var j = JOBS[i];
    btns.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    hots.forEach(function (h, k) { h.classList.toggle('on', k === i); });
    $('#cpTitle').textContent = j.t; $('#cpText').textContent = j.x; $('#cpWhen').textContent = j.w;
    var im = $('#cpImg'); im.src = 'images/' + j.img + '-720.jpg'; im.alt = j.alt; $('#cpCap').textContent = j.cap;
    $('#cutPanel').setAttribute('aria-labelledby', 'sv' + i);
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { setJob(+b.getAttribute('data-i')); }); });
  hots.forEach(function (h) {
    var go = function () { setJob(+h.getAttribute('data-i')); };
    h.addEventListener('click', go);
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  setJob(0);

  /* growth ring: year counts up once */
  var yn = $('#yearNum');
  if (yn && 'IntersectionObserver' in window && !reduce) {
    var done = false;
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) {
        if (e.isIntersecting && !done) {
          done = true; ob.disconnect();
          var from = 1900, to = 1996, t0 = null, dur = 1700;
          var step = function (t) {
            if (!t0) t0 = t;
            var p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
            yn.textContent = Math.round(from + (to - from) * eased);
            if (p < 1) requestAnimationFrame(step);
          };
          yn.textContent = from; requestAnimationFrame(step);
        }
      });
    }, { threshold: .4 }).observe(yn);
  }

  /* storm seasons */
  var SEA = [
    { t: 'Spring storms', x: 'Spring storms bring wind on top of soaked ground, and wet soil lets go of roots more easily. Look at the base and the lean.', l: ['A new lean after a blow', 'Soil lifting or cracking near the trunk', 'Limbs hanging over the roof or driveway'], img: 'storm-suburb', alt: 'A suburban neighbourhood of tree-lined streets under a heavy cloudy sky', cap: 'Illustrative photo: storm clouds over a neighbourhood' },
    { t: 'Summer thunderstorms', x: 'Summer thunderstorms mean lightning and sudden strong gusts. Check afterwards for fresh damage in the crown and on the trunk.', l: ['Split bark or fresh cracks', 'Snapped limbs caught high in the branches', 'Needles browning on one side'], img: 'storm-lake', alt: 'A fork of lightning striking over dark water', cap: 'Illustrative photo: lightning' },
    { t: 'Winter ice', x: 'Ice adds a lot of weight to branches, and pines hold it in their needles. Stay out from underneath while it is on the tree.', l: ['Bowed or sagging branches', 'Cracking sounds in the cold', 'Limbs down across cars, fences or wires'], img: 'suburb-snow', alt: 'Aerial view of a snow-covered neighbourhood street at sunrise', cap: 'Illustrative photo: a frozen neighbourhood' }
  ];
  var tabs = $$('.tab');
  function setSea(i) {
    var s = SEA[i];
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    $('#snTitle').textContent = s.t; $('#snText').textContent = s.x;
    var ul = $('#snList'); ul.textContent = '';
    s.l.forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li); });
    var im = $('#snImg'); im.src = 'images/' + s.img + '-720.jpg'; im.alt = s.alt; $('#snCap').textContent = s.cap;
    $('#season').setAttribute('aria-labelledby', 'st' + i);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { setSea(+t.getAttribute('data-i')); }); });
  setSea(0);

  /* is that pine a problem */
  var MSG = ['Nothing ticked yet. Walk around the tree and look up.', 'One sign. Worth keeping an eye on, and worth asking someone to take a look.', 'Two signs. This is a good time to have it looked at.', 'Three signs. Keep people and cars away from underneath and call.', 'Four signs. Keep well clear of the tree and call.', 'All five. Keep well clear of the tree and call.'];
  var boxes = $$('.sign input');
  function pine() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    $('#vNum').textContent = n; $('#vMsg').textContent = MSG[n];
  }
  boxes.forEach(function (b) { b.addEventListener('change', pine); });
  pine();
})();
