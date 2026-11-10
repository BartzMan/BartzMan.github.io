(function () {
  'use strict';
  /* roof type tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.vt-tabs [role="tab"]'));
  function show(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show((i + tabs.length - 1) % tabs.length, true); }
    });
  });

  /* before / after wipe: the range input covers the photo, so mouse, touch and keyboard all work */
  var wipe = document.getElementById('wipe');
  if (wipe) {
    var range = wipe.querySelector('.vt-wipe-range');
    var set = function () { wipe.style.setProperty('--p', range.value + '%'); };
    range.addEventListener('input', set);
    set();
  }

  /* monsoon check */
  var n = document.getElementById('check-n');
  var btns = document.querySelectorAll('.vt-check-list button');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      var c = 0;
      btns.forEach(function (x) { if (x.getAttribute('aria-pressed') === 'true') c++; });
      if (n) n.textContent = c;
    });
  });
})();
