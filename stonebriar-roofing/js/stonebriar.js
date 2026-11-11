/* Stonebriar Roofing: tabs (roof type, roof day) and the roof-day checklist. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  $$('[data-tabs]').forEach(function (group) {
    var tabs = $$('[role=tab]', group);
    var big = group.querySelector('#bigno');
    function pick(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (big && tab.getAttribute('data-no')) big.textContent = tab.getAttribute('data-no');
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, j = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = n - 1;
        if (j > -1) { e.preventDefault(); pick(tabs[j], true); }
      });
    });
  });

  var prep = document.querySelector('[data-prep]');
  if (prep) {
    var btns = $$('.checks button', prep), pickets = $$('.pickets i', prep), count = prep.querySelector('[data-prep-count]');
    var sync = function () {
      var n = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      pickets.forEach(function (p, i) { p.classList.toggle('on', i < n); });
      count.textContent = n;
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        sync();
      });
    });
    prep.querySelector('[data-prep-clear]').addEventListener('click', function () {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      sync();
    });
  }
})();
