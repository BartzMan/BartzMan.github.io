(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. the lit house */
  var LT = {
    lighting: { n: '1', t: 'Indoor and outdoor lighting', x: 'Porch, path and garden lights make a house safer to walk around and nicer to come home to. The fixtures, switches and wiring all have to suit each other.' },
    garage: { n: '2', t: 'Garage and shop lighting', x: 'Bright, even LED fixtures turn a dim garage or workshop into a space you can actually see in.' },
    meter: { n: '3', t: 'Service and panel upgrades', x: 'The meter and main panel are where power enters the home. An upgrade gives the house room for more circuits and bigger loads.' },
    wing: { n: '4', t: 'Additions and remodels', x: 'A new room or a reworked kitchen needs new circuits, new lighting and a panel that can carry the extra load.' },
    spa: { n: '5', t: 'Hot tubs and spas', x: 'A spa needs its own dedicated circuit, an outdoor shut-off within sight, and wiring run to suit where the tub sits.' }
  };
  var order = ['lighting', 'garage', 'meter', 'wing', 'spa'];
  var svg = $('#house-svg'), timers = [];
  function grp(k) { return $('.lt[data-lt="' + k + '"]', svg); }
  function lit(k) { return grp(k).classList.contains('is-lit'); }
  function setLit(k, on) {
    grp(k).classList.toggle('is-lit', on);
    var c = $('[data-chip="' + k + '"]'); c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('[data-hot="' + k + '"]', svg).classList.toggle('is-on', on);
  }
  function show(k) {
    var d = LT[k];
    $('#hc-num').textContent = 'Light ' + d.n; $('#hc-title').textContent = d.t; $('#hc-text').textContent = d.x;
    $$('[data-chip]').forEach(function (c) { c.classList.toggle('is-cur', c.getAttribute('data-chip') === k); });
    $$('[data-hot]', svg).forEach(function (h) { h.classList.toggle('is-cur', h.getAttribute('data-hot') === k); });
  }
  function state() {
    var n = order.filter(lit).length;
    $('#hc-state').textContent = n + ' of 5 lights on';
    var b = $('#all-btn'); b.setAttribute('aria-pressed', n === 5 ? 'true' : 'false'); b.textContent = n === 5 ? 'Lights off' : 'Lights on, one by one';
  }
  function press(k) {
    var cur = $('[data-chip="' + k + '"]').classList.contains('is-cur');
    if (!lit(k)) setLit(k, true); else if (cur) setLit(k, false);
    show(k); state();
  }
  $$('[data-chip]').forEach(function (c) { c.addEventListener('click', function () { press(c.getAttribute('data-chip')); }); });
  $$('[data-hot]', svg).forEach(function (h) {
    var k = h.getAttribute('data-hot');
    h.setAttribute('tabindex', '0'); h.setAttribute('role', 'button'); h.setAttribute('aria-label', 'Light ' + LT[k].n + ': ' + LT[k].t);
    h.addEventListener('click', function () { press(k); });
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(k); } });
  });
  $('#all-btn').addEventListener('click', function () {
    timers.forEach(clearTimeout); timers = [];
    if (order.every(lit)) { order.forEach(function (k) { setLit(k, false); }); state(); return; }
    order.forEach(function (k, i) { timers.push(setTimeout(function () { setLit(k, true); show(k); state(); }, i * 650)); });
  });
  setLit('lighting', true); show('lighting'); state();

  /* 2. service tabs */
  var tabs = $$('[data-svc]');
  function svc(n) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-svc') === n;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      var p = document.getElementById('sp' + t.getAttribute('data-svc'));
      p.hidden = !on; if (on) { p.classList.remove('in'); void p.offsetWidth; p.classList.add('in'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { svc(t.getAttribute('data-svc')); });
    t.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (d) { e.preventDefault(); var nx = tabs[(i + d + tabs.length) % tabs.length]; nx.focus(); svc(nx.getAttribute('data-svc')); }
    });
  });

  /* 3. hot tub checklist with bulbs */
  var bulbs = $('#bulbs'), boxes = $$('.ht-list input');
  var bulb = '<svg viewBox="0 0 40 60" width="40" height="60" focusable="false"><path class="bulb-glass" d="M20 4a14 14 0 0 0-8 25.5V38h16v-8.5A14 14 0 0 0 20 4Z"/><path d="M13 44h14M15 50h10M17 56h6" stroke="#E9E1D3" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>';
  var out = ''; for (var i = 0; i < 5; i++) out += '<span>' + bulb + '</span>';
  bulbs.innerHTML = out;
  function bl() {
    var n = 0; boxes.forEach(function (b, i) { if (b.checked) n++; bulbs.children[i].classList.toggle('is-on', b.checked); });
    $('#ht-count').textContent = n + ' of 5 answered';
  }
  boxes.forEach(function (b) { b.addEventListener('change', bl); });
})();
