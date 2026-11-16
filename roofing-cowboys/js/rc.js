(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Brand register */
  var ENTRIES = [
    { no: 'Reg. No. 0001', name: 'Residential roofing', cap: 'A white farmhouse-style home with a new black roof. Own photo.',
      text: 'Roofing for homes, from a simple ranch to a big farmhouse-style place. This is what most folks mean when they say they need a new roof.' },
    { no: 'Reg. No. 0002', name: 'New-construction roofing', cap: 'A long single-storey build, dried in. Own photo.',
      text: 'Roofing for a house going up. The roof is dried in first with sheathing and underlayment, then shingled once the building is ready for it.' },
    { no: 'Reg. No. 0003', name: 'Multifamily and commercial roofing', cap: 'An apartment complex with its roof on. Own photo.',
      text: 'Apartment complexes and other large buildings, with many roof sections and flat decks edged in shingle.' },
    { no: 'Reg. No. 0004', name: 'Roof repair', cap: 'Hands and a hammer over old decking. Illustrative stock.',
      text: 'A targeted fix for a leak, a few missing shingles or damaged flashing, when the rest of the roof still has life in it.' }
  ];
  var tiles = $$('.tile');
  function pick(i) {
    var t = tiles[i], e = ENTRIES[i];
    tiles.forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
    $('#lpNo').textContent = e.no;
    $('#lpName').textContent = e.name;
    $('#lpText').textContent = e.text;
    $('#lpCap').textContent = e.cap;
    var img = $('#lpImg'), base = t.getAttribute('data-img');
    img.src = base + '.jpg'; img.width = +t.getAttribute('data-w'); img.height = +t.getAttribute('data-h'); img.alt = t.getAttribute('data-alt');
    $('#lpMark').innerHTML = $('.mark', t).innerHTML;
  }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { pick(i); }); });
  if (tiles.length) pick(0);

  /* Ask your roofer */
  var qs = $$('.ask-q'), cnt = $('#askCount');
  qs.forEach(function (q) {
    q.addEventListener('click', function () {
      var on = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', String(on));
      q.dataset.asked = on ? '1' : '';
      cnt.textContent = qs.filter(function (x) { return x.dataset.asked; }).length;
    });
  });

  /* Ledger tabs */
  var tabs = $$('.chips [role="tab"]');
  function openTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); openTab(n);
    });
  });
})();
