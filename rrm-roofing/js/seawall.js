(function(){
  "use strict";
  var $ = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* ---- salt air roof check ---- */
  var spots = $$('.sw-spot'), chips = $$('.sw-chips button'), data = $$('.sw-pdata'), imgs = $$('.sw-pimg'), parts = $$('.sw-part');
  var order = spots.map(function(b){ return b.getAttribute('data-part'); });
  var cur = 0;
  function show(i){
    cur = (i + order.length) % order.length;
    var key = order[cur];
    spots.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-part') === key ? 'true' : 'false'); });
    chips.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-part') === key ? 'true' : 'false'); });
    parts.forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-part') === key); });
    imgs.forEach(function(f){ f.classList.toggle('on', f.getAttribute('data-img') === key); });
    var d = data.filter(function(x){ return x.getAttribute('data-part') === key; })[0];
    if (!d) return;
    $('.sw-pn').textContent = 'Part ' + d.getAttribute('data-n') + ' of ' + order.length;
    $('.sw-ptitle').textContent = d.getAttribute('data-title');
    $('.sw-pcopy').innerHTML = d.innerHTML;
  }
  spots.concat(chips).forEach(function(b){
    b.addEventListener('click', function(){ show(order.indexOf(b.getAttribute('data-part'))); });
  });
  $$('.sw-pnav button').forEach(function(b){ b.addEventListener('click', function(){ show(cur + parseInt(b.getAttribute('data-dir'), 10)); }); });
  if (order.length) show(0);

  /* ---- service tabs ---- */
  var tabs = $$('.sw-tabs [role=tab]');
  function pick(t, focus){
    tabs.forEach(function(x){
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ pick(t); });
    t.addEventListener('keydown', function(e){
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n){ e.preventDefault(); pick(n, true); }
    });
  });

  /* ---- hurricane-season knots ---- */
  var knots = $$('.sw-knots button'), count = $('.sw-tally .count'), bar = $('.sw-tally .bar'), fill = $('.sw-tally .bar i');
  function tally(){
    var n = knots.filter(function(b){ return b.getAttribute('aria-pressed') === 'true'; }).length;
    count.textContent = n + ' of ' + knots.length + ' tied down';
    fill.style.width = (n / knots.length * 100) + '%';
    bar.classList.toggle('full', n === knots.length);
    if (n === knots.length) count.textContent = 'All 5 tied down. Stay safe.';
  }
  knots.forEach(function(b){ b.addEventListener('click', function(){ b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); tally(); }); });
})();
