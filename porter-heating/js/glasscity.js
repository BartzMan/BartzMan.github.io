/* Porter: Glass City Thermal interactions (thermal house spots, season checks, reeded band) */
(function () {
  var SPOTS = [
    { z: 'warm', zone: 'Heating', h: 'Furnace', a: '#heating', at: 'Heating services',
      p: 'The furnace warms the air and the ducts carry it room to room. When rooms stay cold or the furnace keeps switching on and off, it is time for a look.' },
    { z: 'warm', zone: 'Heating and cooling', h: 'Thermostat', a: '#heating', at: 'Thermostats',
      p: 'The thermostat tells the furnace and the AC when to run. If the house never reaches the setting, the thermostat and its wiring are among the first things checked.' },
    { z: 'cool', zone: 'Air conditioning', h: 'Outdoor AC unit', a: '#cooling', at: 'Air conditioning services',
      p: 'The unit outside pushes the heat from inside the house out into the yard. One that hums but will not start, or runs while the house stays warm, needs a look.' },
    { z: 'cool', zone: 'Heating and cooling', h: 'Supply vents', a: '#cooling', at: 'Air conditioning services',
      p: 'Rooms that run hotter or colder than the rest of the house often come down to airflow: blocked vents, a tired blower or ducts that need attention.' },
    { z: 'volt', zone: 'Electrical', h: 'Electrical panel', a: '#electrical', at: 'Electrical services',
      p: 'Breakers feed every circuit in the house, the furnace and the AC included. A breaker that keeps tripping is a reason to call, not to keep resetting it.' },
    { z: 'volt', zone: 'Electrical', h: 'Lights and outlets', a: '#electrical', at: 'Electrical services',
      p: 'Flickering lights, dead outlets and new light fixtures are everyday electrical work, done by the same team that looks after the furnace and the AC.' }
  ];
  var spots = document.querySelectorAll('.gc-spot');
  var ro = { z: document.querySelector('#readout .gc-dot'), zone: document.getElementById('ro-zone'), n: document.getElementById('ro-n'),
    h: document.getElementById('ro-h'), p: document.getElementById('ro-p'), a: document.getElementById('ro-a') };
  function show(i) {
    var s = SPOTS[i]; if (!s || !ro.h) return;
    spots.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    ro.z.className = 'gc-dot z-' + s.z; ro.zone.textContent = s.zone; ro.n.textContent = i + 1;
    ro.h.textContent = s.h; ro.p.textContent = s.p; ro.a.setAttribute('href', s.a); ro.a.firstChild.nodeValue = s.at + ' ';
  }
  spots.forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-spot')); }); });

  /* season tabs + check panes */
  var tabs = document.querySelectorAll('.gc-season [role="tab"]');
  var count = document.getElementById('ck-count');
  function current() { var t = document.querySelector('.gc-season [aria-selected="true"]'); return t ? document.getElementById(t.getAttribute('aria-controls')) : null; }
  function recount() {
    var set = current(); if (!set || !count) return;
    var n = set.querySelectorAll('.gc-chk[aria-pressed="true"]').length;
    count.textContent = n === 4 ? 'All 4 cleared' : n + ' of 4 cleared';
  }
  function pick(t) {
    tabs.forEach(function (o) {
      var on = o === t; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(o.getAttribute('aria-controls')); if (panel) panel.hidden = !on;
    });
    recount();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(n); n.focus(); }
    });
  });
  document.querySelectorAll('.gc-chk').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); recount(); });
  });

  /* reeded band: the glass strips part as the band comes into view */
  var band = document.querySelector('.gc-reed-band');
  if (band && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var strips = band.querySelectorAll('.gc-reed-strips i');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        strips.forEach(function (s, k) { s.style.transitionDelay = (k * 70) + 'ms'; s.style.transform = e.isIntersecting ? 'scaleX(' + (1 - k * 0.08) + ')' : 'scaleX(1)'; });
      });
    }, { threshold: 0.45 });
    io.observe(band);
  }
})();
