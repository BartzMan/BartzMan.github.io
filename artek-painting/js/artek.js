(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. rooms: expanding tiles */
  var rooms = $$('.room');
  function openRoom(r) {
    rooms.forEach(function (x) { x.setAttribute('aria-expanded', x === r ? 'true' : 'false'); });
  }
  rooms.forEach(function (r) {
    r.addEventListener('click', function () { openRoom(r); });
    r.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover) and (min-width:641px)').matches) openRoom(r); });
  });

  /* 2. stair treads */
  var treads = $$('.tread');
  treads.forEach(function (t) {
    var b = t.querySelector('.tread-btn');
    b.addEventListener('click', function () {
      var on = !t.classList.contains('open');
      treads.forEach(function (x) { x.classList.remove('open'); x.querySelector('.tread-btn').setAttribute('aria-expanded', 'false'); });
      if (on) { t.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* 3. checker gallery: turn a tile */
  $$('.tile').forEach(function (t) {
    var front = t.querySelector('.front'), again = t.querySelector('.again');
    front.addEventListener('click', function () { t.classList.add('turned'); });
    again.addEventListener('click', function () { t.classList.remove('turned'); });
  });
})();
