/* Miklo Landscaping: the yard picker (routes to a detail) and the plant schedule (plan symbols <-> schedule rows). */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. What does your yard need? -> points to the matching detail */
  var routes = {
    clean: { name: 'Detail 4: Yard clean-up', id: 'd-clean' },
    turf: { name: 'Detail 1: Artificial turf', id: 'd-turf' },
    rock: { name: 'Detail 3: Decorative rock', id: 'd-rock' },
    pavers: { name: 'Detail 2: Pavers & fire pits', id: 'd-pavers' }
  };
  var opts = $$('.mk-picker-opts button');
  var out = document.querySelector('[data-pick-out]');
  var link = document.querySelector('[data-pick-link]');
  opts.forEach(function (b) {
    b.addEventListener('click', function () {
      var r = routes[b.getAttribute('data-route')];
      opts.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.mk-detail').forEach(function (d) { d.classList.toggle('is-picked', d.id === r.id); });
      out.textContent = 'Start with ' + r.name + '.';
      link.hidden = false; link.href = '#' + r.id;
    });
  });

  /* 2. Plant schedule: tap a symbol or a row */
  var notes = {
    PV: 'Arizona’s state tree: green bark, a flood of yellow flowers in spring and light, filtered shade. Give it room to spread over a patio or bed.',
    AG: 'Sculptural rosettes that need very little water once settled. Plant them well back from walks and play areas: the leaf tips are sharp.',
    TS: 'Silver-grey leaves and purple flowers that often appear after summer rain and humidity. Let it keep its natural shape rather than shearing it into balls.',
    RY: 'Tall coral flower spikes that hummingbirds visit. Tough in reflected heat next to walls and driveways.',
    LA: 'Spreading colour for much of the year. Frost can nip it back in winter; it usually regrows in spring.'
  };
  var rows = $$('.mk-row');
  var syms = $$('.mk-sym');
  var note = document.querySelector('[data-note]');
  var noteKey = document.querySelector('[data-note-key]');
  var panel = document.getElementById('row-note');
  function show(k, focus) {
    rows.forEach(function (r) {
      var on = r.getAttribute('data-key') === k;
      r.setAttribute('aria-selected', String(on)); r.tabIndex = on ? 0 : -1;
      if (on) { if (focus) r.focus(); if (panel) panel.setAttribute('aria-labelledby', r.id); }
    });
    syms.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-key') === k); });
    note.textContent = notes[k]; noteKey.textContent = k;
  }
  rows.forEach(function (r, i) {
    r.addEventListener('click', function () { show(r.getAttribute('data-key')); });
    r.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % rows.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + rows.length) % rows.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = rows.length - 1;
      if (n !== null) { e.preventDefault(); show(rows[n].getAttribute('data-key'), true); }
    });
  });
  syms.forEach(function (s) { s.addEventListener('click', function () { show(s.getAttribute('data-key')); }); });
  show('PV');
})();
