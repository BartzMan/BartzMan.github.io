/* Baek's pipe atlas: service points + layers, drain check (kit.js does menu, dock, lightbox, reveals, form). */
(function () {
  'use strict';
  var data = {
    rooter: ['01', 'drawing', 'Drain cleaning & rooter', 'Clearing clogged and slow drains with a rooter cable, from one sink to the main line out to the street. You need it when water drains slowly, backs up or gurgles.', 'On the drawing: the cleanout by the street.'],
    dwv: ['02', 'their photo', 'Drain, waste & vent lines', 'The black pipes that carry used water down and out of the house, and the vents that let them flow. You need it when lines are cracked, sagging or being added in a remodel.', 'On the drawing: the stack that rises through the roof.'],
    supply: ['03', 'their photo', 'Water supply lines', 'The copper lines that bring hot and cold water from the meter to every fixture. You need it when a pipe leaks, pressure drops or a room is being re-plumbed.', 'On the drawing: the meter, the water heater and the copper runs.'],
    roughin: ['04', 'their photo', 'Rough-in for builds & remodels', 'All the pipe that goes into the walls and floors before the drywall: drains, vents and supply stub-outs. You need it for an addition, a new bathroom or a full remodel.', 'On the drawing: the open framing on the back wall.'],
    hookups: ['05', 'drawing', 'Fixtures & hookups', 'Connecting toilets, sinks, tubs and washers to the lines in the wall. You need it when a fixture is new, moved, or leaking where it connects.', 'On the drawing: the laundry outlet box.']
  };
  var draw = document.querySelector('.pa-atlas-draw');
  var detail = document.getElementById('atlas-detail');
  var ctrls = document.querySelectorAll('.pa-spot, .pa-leg');
  function show(key) {
    var d = data[key]; if (!d || !detail) return;
    draw.setAttribute('data-focus', key);
    detail.querySelectorAll('.pa-detail-media').forEach(function (m) { m.hidden = m.getAttribute('data-media') !== key; });
    detail.querySelector('.pa-detail-no').firstChild.nodeValue = 'Point ' + d[0] + ' ';
    detail.querySelector('.pa-detail-src').textContent = d[1];
    detail.querySelector('h3').textContent = d[2];
    detail.querySelector('.pa-detail-what').textContent = d[3];
    detail.querySelector('.pa-detail-where').textContent = d[4];
    ctrls.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-spot') === key ? 'true' : 'false'); });
  }
  ctrls.forEach(function (c) { c.addEventListener('click', function () { show(c.getAttribute('data-spot')); }); });

  var fig = document.querySelector('.pa-atlas-fig');
  document.querySelectorAll('.pa-layer').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      fig.classList.toggle('pa-off-' + b.getAttribute('data-layer'), !on);
    });
  });

  /* one slow drain, or the main line? */
  var ans = {};
  var mini = document.querySelector('.pa-mini');
  var vh = document.querySelector('.pa-verdict-h');
  var vp = document.querySelector('.pa-verdict-p');
  function verdict() {
    var n = Object.keys(ans).length, show = 'none', h, p;
    if (ans.gurgle === 'yes' || ans.backup === 'yes') {
      show = 'main'; h = 'Probably the main line.';
      p = 'Every fixture shares one pipe out to the street, so trouble there shows up in more than one place. Stop running water and call a plumber.';
    } else if (n < 3) {
      h = 'Answer the three checks.'; p = 'The drawing marks the likely spot: one fixture\'s own drain, or the main line that every fixture shares.';
    } else if (ans.one === 'yes') {
      show = 'branch'; h = 'Probably that fixture\'s own drain.';
      p = 'The clog is likely in its trap or branch line. Try a plunger; skip harsh chemical cleaners on a full clog, and call if it will not clear.';
    } else {
      h = 'Probably not a blockage.'; p = 'If nothing is slow and nothing gurgles, look at the supply side instead: low pressure or a slow fill.';
    }
    mini.setAttribute('data-show', show); vh.textContent = h; vp.textContent = p;
  }
  document.querySelectorAll('.pa-q').forEach(function (q) {
    var btns = q.querySelectorAll('button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        ans[q.getAttribute('data-q')] = b.getAttribute('data-a');
        verdict();
      });
    });
  });
})();
