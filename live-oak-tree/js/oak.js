(function () {
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* month label on the header dial follows the scroll through the year (starts in March) */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var lab = $('[data-month]');
  function tick() {
    if (!lab) return;
    var h = root.scrollHeight - innerHeight, p = h > 0 ? Math.min(0.999, scrollY / h) : 0;
    lab.textContent = MON[(2 + Math.floor(p * 12)) % 12];
  }
  addEventListener('scroll', tick, { passive: true }); tick();

  /* the tree year */
  var grid = $('#yeargrid'), sec = $('#year');
  var TITLE = { spring: 'Fig. 2 · Spring · Mar to May', summer: 'Fig. 3 · Summer · Jun to Aug', fall: 'Fig. 4 · Fall · Sep to Nov', winter: 'Fig. 5 · Winter · Dec to Feb' };
  function season(s) {
    sec.setAttribute('data-season', s);
    $('#dial').setAttribute('data-season', s);
    $$('.seasons button', grid).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-season') === s)); });
    $$('.sp', grid).forEach(function (p) { if (p.getAttribute('data-sp') === s) p.setAttribute('data-on', ''); else p.removeAttribute('data-on'); });
    $$('.st', grid).forEach(function (t) { t.hidden = t.getAttribute('data-st') !== s; });
    $('[data-plate]', grid).textContent = TITLE[s];
  }
  if (grid) {
    $$('.seasons button', grid).forEach(function (b) { b.addEventListener('click', function () { season(b.getAttribute('data-season')); }); });
    $$('.wedge', grid).forEach(function (w) { w.addEventListener('click', function () { season(w.getAttribute('data-season')); }); });
  }

  /* trees / landscape tabs */
  var tabs = $$('.tabs [role="tab"]');
  function tab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { tab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; tab(n); n.focus(); }
    });
  });

  /* oak wilt notes */
  $$('.notes button').forEach(function (b) { b.addEventListener('click', function () {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  }); });
})();
