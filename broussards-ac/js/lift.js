/* Broussard's: the lift. Home/Commercial pendant, storm-stage tags, 6-check trolley. */
(function () {
  function tabs(list, onChange) {
    var btns = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function pick(b, focus) {
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) b.focus();
      if (onChange) onChange(b);
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = btns[(i + 1) % btns.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
        if (e.key === 'Home') n = btns[0];
        if (e.key === 'End') n = btns[btns.length - 1];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
  }

  var pendant = document.querySelector('.lf-pendant');
  if (pendant) tabs(pendant, function (b) {
    var id = b.getAttribute('aria-controls');
    document.querySelectorAll('.lf-switch-fig').forEach(function (f) { f.classList.toggle('is-on', f.getAttribute('data-pane') === id); });
  });

  var storm = document.querySelector('.lf-storm-line');
  if (storm) tabs(storm, function (b) {
    var s = b.getAttribute('data-stage');
    document.querySelectorAll('.lf-storm-bg img').forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-for') === s); });
  });

  var list = document.getElementById('lf-checklist');
  if (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.lf-check'));
    var meter = document.querySelector('.lf-meter'), n = document.getElementById('lf-meter-n'), done = document.getElementById('lf-check-done');
    function count() {
      var c = items.filter(function (it) { return it.classList.contains('is-done'); }).length;
      if (meter) meter.style.setProperty('--p', (c / items.length).toFixed(3));
      if (n) n.textContent = c;
      if (done) done.hidden = c < items.length;
    }
    items.forEach(function (it) {
      var b = it.querySelector('.lf-check-btn'), body = document.getElementById(b.getAttribute('aria-controls'));
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(open));
        body.hidden = !open;
        if (open) it.classList.add('is-done');
        count();
      });
    });
    count();
  }
})();
