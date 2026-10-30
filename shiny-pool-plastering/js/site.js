(function () {
  document.documentElement.classList.add('js');

  // phone menu sheet
  var openBtn = document.querySelector('.hd-menu');
  var menu = document.getElementById('menu');
  if (openBtn && menu) {
    var shut = function (refocus) {
      menu.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (refocus) openBtn.focus();
    };
    openBtn.addEventListener('click', function () {
      menu.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      menu.querySelector('.menu-links a').focus();
    });
    menu.querySelector('.menu-close').addEventListener('click', function () { shut(true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') shut(true);
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080 && !menu.hidden) shut(false); });
  }

  // the pool: keys act as tabs, drawing parts are tap targets for the same tabs
  var keys = Array.prototype.slice.call(document.querySelectorAll('.key'));
  var parts = document.querySelectorAll('.part');
  var shapes = document.querySelectorAll('.pad-svg .pt');
  if (keys.length) {
    var list = document.querySelector('.keys');
    list.setAttribute('role', 'tablist');
    keys.forEach(function (k) {
      k.parentNode.setAttribute('role', 'presentation');
      k.setAttribute('role', 'tab');
      k.id = 'key-' + k.dataset.part;
      k.setAttribute('aria-controls', 'part-' + k.dataset.part);
    });
    Array.prototype.forEach.call(parts, function (p) {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', 'key-' + p.dataset.part);
    });
    var select = function (name, focusKey) {
      keys.forEach(function (k) {
        var on = k.dataset.part === name;
        k.setAttribute('aria-selected', on ? 'true' : 'false');
        k.tabIndex = on ? 0 : -1;
        if (on && focusKey) k.focus();
      });
      Array.prototype.forEach.call(parts, function (p) { p.hidden = p.dataset.part !== name; });
      Array.prototype.forEach.call(shapes, function (s) { s.classList.toggle('on', s.dataset.part === name); });
    };
    keys.forEach(function (k, i) {
      k.addEventListener('click', function (e) { e.preventDefault(); select(k.dataset.part); });
      k.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % keys.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + keys.length) % keys.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = keys.length - 1;
        if (j !== null) { e.preventDefault(); select(keys[j].dataset.part, true); }
      });
    });
    Array.prototype.forEach.call(shapes, function (s) {
      s.addEventListener('click', function () { select(s.dataset.part); });
    });
    select('prep');
  }

  // on phones the drawing scrolls sideways: make that region reachable by keyboard
  var sc = document.querySelector('.pad-scroll');
  var fitScroll = function () {
    if (!sc) return;
    if (sc.scrollWidth > sc.clientWidth + 2) {
      sc.tabIndex = 0; sc.setAttribute('role', 'region'); sc.setAttribute('aria-label', 'Pad drawing, scrolls sideways');
    } else {
      sc.removeAttribute('tabindex'); sc.removeAttribute('role'); sc.removeAttribute('aria-label');
    }
  };
  fitScroll(); window.addEventListener('resize', fitScroll);

  // quote form: nothing is sent from the demo (sc-form.js shows the preview note)
  var form = document.getElementById('pool-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('f-err');
      if (!(form.elements.name.value || '').trim()) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
    });
  }
})();
