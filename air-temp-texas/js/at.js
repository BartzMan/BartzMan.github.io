(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* airflow house */
  var cards = $$('.at-card article');
  var ctrls = $$('.at-spot, .at-legend button');
  function pick(k) {
    cards.forEach(function (c) { c.hidden = c.getAttribute('data-k') !== k; });
    ctrls.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-k') === k)); });
  }
  ctrls.forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-k')); }); });
  var dw = document.querySelector('.at-drawwrap');
  if (dw && dw.scrollWidth > dw.clientWidth) dw.scrollLeft = (dw.scrollWidth - dw.clientWidth) * 0.4;

  /* cooling / heating switch (both switches stay in step) */
  var modeBtns = $$('.at-mode button');
  var svcs = $$('.at-service');
  function mode(m) {
    root.setAttribute('data-mode', m);
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
    svcs.forEach(function (s) { var sm = s.getAttribute('data-mode'); s.hidden = !!sm && sm !== m; });
    $$('.at-card [data-k="5"] h3').forEach(function () {});
  }
  modeBtns.forEach(function (b) { b.addEventListener('click', function () { mode(b.getAttribute('data-m')); }); });
  mode('cool');

  /* filter checks */
  var items = $$('#pleats li');
  var msgs = ['Nothing ticked yet.', 'One down.', 'Air is starting to move.', 'Halfway through.', 'Nearly there.', 'All clear. Still struggling? Call.'];
  function tally() {
    var n = items.filter(function (li) { return li.classList.contains('done'); }).length;
    document.getElementById('flow-out').textContent = (n * 20) + '%';
    document.getElementById('flow-bar').style.width = (n * 20) + '%';
    document.getElementById('flow-msg').textContent = msgs[n];
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
