/* Father & Son: the joint-check panel and the yard filter. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Joint check: pick a sign, the drawn panel shows it and the text explains it */
  var signs = {
    bloom: { t: 'White powder on brick', b: 'A white, chalky bloom on brick usually means water is moving through the wall. Look above it for the source: gutters, downspouts or splashing from below.', at: [110, 222] },
    joint: { t: 'Soft or missing mortar', b: 'If a key scrapes mortar out of a joint easily, the joints are wearing away. Worn joints let water in behind the brick, so they are worth repointing.', at: [352, 150] },
    crack: { t: 'A stair-step crack', b: 'A crack that steps along the mortar joints can mean the wall has moved. Photograph it with a coin for scale, check it again in a few months, and have it looked at if it grows.', at: [376, 112] },
    spall: { t: 'Flaking brick faces', b: 'Brick faces that pop off after winter are usually freeze and thaw damage from trapped water. Fix where the water comes from before replacing the brick.', at: [548, 140] },
    sink: { t: 'Sunken or rocking pavers', b: 'Low spots, puddles and pavers that rock underfoot usually point to the base underneath, not the pavers. Lifting, re-grading and re-setting fixes the cause.', at: [302, 372] }
  };
  var order = ['bloom', 'joint', 'crack', 'spall', 'sink'];
  var tabs = $$('.fs-signs [role="tab"]');
  var panel = document.querySelector('.fs-panel');
  var pin = document.querySelector('.fs-pin');
  var tTitle = document.querySelector('[data-sign-title]');
  var tBody = document.querySelector('[data-sign-body]');
  var tNo = document.querySelector('[data-sign-no]');
  var box = document.getElementById('sp');
  function show(key, focus) {
    var s = signs[key]; if (!s) return;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-sign') === key;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      if (on) { if (focus) t.focus(); if (box) box.setAttribute('aria-labelledby', t.id); }
    });
    if (panel) panel.setAttribute('data-show', key);
    if (pin) pin.style.transform = 'translate(' + s.at[0] + 'px,' + s.at[1] + 'px)';
    if (pin) pin.setAttribute('transform', 'translate(' + s.at[0] + ' ' + s.at[1] + ')');
    tTitle.textContent = s.t; tBody.textContent = s.b; tNo.textContent = order.indexOf(key) + 1;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('data-sign')); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); show(tabs[n].getAttribute('data-sign'), true); }
    });
  });
  if (panel) {
    $$('.fs-sym', panel).forEach(function (g) {
      g.style.cursor = 'pointer';
      g.addEventListener('click', function () { show(g.getAttribute('data-sym')); });
    });
  }
  show('bloom');

  /* The yard: filter stones by material */
  var chips = $$('.fs-chips button');
  var stones = $$('.fs-ys');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      stones.forEach(function (s) {
        var m = s.getAttribute('data-mat');
        s.classList.toggle('is-dim', !(f === 'all' || m === f || m === 'all'));
      });
    });
  });
})();
