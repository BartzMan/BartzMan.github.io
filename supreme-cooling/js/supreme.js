(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- 1. the lot plan ---- */
  var ROOMS = {
    living: { name: 'Living room', head: 'High on the wall that faces the longest stretch of the room, so air carries across the seating instead of blowing on one spot.', unit: 'On the right side yard, on a pad or bracket close to the wall so the line stays short and the fan has room on every side.' },
    kitchen: { name: 'Kitchen and dining', head: 'Above head height and away from the cooktop, aimed along the dining side of the room rather than at the stove.', unit: 'On the left side yard beside the kitchen wall, kept clear of the downspout and the meter.' },
    primary: { name: 'Primary bedroom', head: 'On the wall opposite the foot of the bed, so air passes over the room instead of straight onto the pillows.', unit: 'In the left side yard, set a little back from the corner so it stays out of the walkway.' },
    bed2: { name: 'Second bedroom', head: 'Over the door or dresser wall, so the air is not aimed at the bed.', unit: 'In the right side yard, on a wall bracket if the ground is too tight for a pad.' },
    office: { name: 'Home office', head: 'Above the desk wall but not pointing at the chair, where a draft would be felt all day.', unit: 'In the right side yard near the front of the house, with the line tucked along the wall.' }
  };
  var plan = $('#plan');
  function pick(key) {
    if (!ROOMS[key]) return;
    $$('.room', plan).forEach(function (g) { var on = g.getAttribute('data-room') === key; g.classList.toggle('is-on', on); g.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    $$('.unit', plan).forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-unit') === key); });
    $$('.link', plan).forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-link') === key); });
    $$('[data-room-btn]').forEach(function (b) { var on = b.getAttribute('data-room-btn') === key; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    $('#room-name').textContent = ROOMS[key].name;
    $('#room-head').textContent = ROOMS[key].head;
    $('#room-unit').textContent = ROOMS[key].unit;
  }
  if (plan) {
    $$('.room', plan).forEach(function (g) {
      var k = g.getAttribute('data-room');
      g.addEventListener('click', function () { pick(k); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } });
    });
    $$('[data-room-btn]').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-room-btn')); }); });
    pick('living');
  }

  /* ---- 2. mini-split / central AC toggle ---- */
  var tabs = $$('[data-sys]'), tg = $('.toggle');
  function sys(key) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-sys') === key;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      var p = document.getElementById('pane-' + t.getAttribute('data-sys'));
      if (p) { p.hidden = !on; if (on) { p.classList.remove('pane-in'); void p.offsetWidth; p.classList.add('pane-in'); } }
    });
    if (tg) tg.setAttribute('data-on', key);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { sys(t.getAttribute('data-sys')); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + 1) % tabs.length]; n.focus(); sys(n.getAttribute('data-sys')); }
    });
  });
  sys('mini');

  /* ---- 3. head counter ---- */
  var boxes = $$('.chips input'), open = $('#openplan');
  var glyph = '<svg viewBox="0 0 60 24" width="60" height="24" focusable="false"><rect x="1.5" y="3" width="57" height="14" rx="4" fill="#fff" stroke="#13294B" stroke-width="1.6"/><path d="M8 12h44" stroke="#13294B" stroke-width="1.2"/><path d="M14 21q16 4 32 0" fill="none" stroke="#13294B" stroke-width="1.2" stroke-dasharray="3 3"/></svg>';
  function count() {
    var sel = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
    var n = sel.length;
    if (open.checked && sel.indexOf('living') > -1 && sel.indexOf('kitchen') > -1) n -= 1;
    $('#heads-n').textContent = n;
    $('#heads-w').textContent = n === 1 ? 'head' : 'heads';
    var g = '';
    for (var i = 0; i < n; i++) g += '<span style="--i:' + i + '">' + glyph + '</span>';
    $('#heads-g').innerHTML = g;
    var t;
    if (n === 0) t = 'Choose at least one space to see a rough count.';
    else if (n === 1) t = 'One head can cover a single room or an open space. Sizing it to the room, not to the biggest unit, is what keeps the air comfortable.';
    else t = 'A rough starting point: about ' + n + ' heads, one per space you want to control on its own. A site visit and a load calculation confirm the real number and the size of each.';
    $('#heads-t').textContent = t;
  }
  boxes.concat(open ? [open] : []).forEach(function (b) { b.addEventListener('change', count); });
  if (open) count();
})();
