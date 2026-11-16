(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* the oak map */
  var panels = $$('.dk-stage article');
  var ctrls = $$('.dk-spot, .dk-legend button');
  function pick(k) {
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-k') !== k; });
    ctrls.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-k') === k)); });
  }
  ctrls.forEach(function (c) {
    c.addEventListener('click', function () {
      pick(c.getAttribute('data-k'));
      if (window.matchMedia('(max-width:900px)').matches && c.classList.contains('dk-legend-btn') === false) {
        var st = document.querySelector('.dk-stage');
        if (st && c.classList.contains('dk-spot')) { var r = st.getBoundingClientRect(); if (r.top > window.innerHeight * 0.8) st.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });
  });

  var dw=document.querySelector('.dk-drawwrap');if(dw&&dw.scrollWidth>dw.clientWidth)dw.scrollLeft=(dw.scrollWidth-dw.clientWidth)*0.62;
  /* service tabs */
  var tabs = $$('.dk-tabs [role=tab]');
  function showTab(t) {
    tabs.forEach(function (b) {
      var on = b === t;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i + tabs.length - 1) % tabs.length];
      if (n) { e.preventDefault(); showTab(n); n.focus(); }
    });
  });

  /* storm checks */
  var items = $$('#checks li');
  var msgs = ['Nothing ticked yet.', 'One to watch.', 'Two flagged.', 'Worth a closer look.', 'Time to call.', 'Call before the next storm.'];
  function tally() {
    var n = items.filter(function (li) { return li.classList.contains('done'); }).length;
    document.getElementById('check-count').textContent = n + ' of 5 ticked';
    document.getElementById('check-bar').style.width = (n * 20) + '%';
    document.getElementById('check-msg').textContent = msgs[n];
  }
  items.forEach(function (li) {
    var b = li.querySelector('button');
    b.addEventListener('click', function () {
      var on = !li.classList.contains('done');
      li.classList.toggle('done', on);
      b.setAttribute('aria-pressed', String(on));
      tally();
    });
  });
})();
