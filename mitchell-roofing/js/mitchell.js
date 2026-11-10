(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. the street: tap a lot to open that job */
  var lots = $$('.yd-lot');
  lots.forEach(function (b) {
    b.addEventListener('click', function () {
      var n = b.getAttribute('data-job');
      lots.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('[data-job-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-job-panel') !== n; });
    });
  });

  /* 2. the roof-type yard-sign flags */
  var tabs = $$('.yd-flag');
  function pick(t, focus) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    $$('.yd-svc').forEach(function (p) { p.hidden = p.id !== 'svc-' + t.getAttribute('data-svc'); });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = -1;
      if (k === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') j = (i + tabs.length - 1) % tabs.length;
      if (j > -1) { e.preventDefault(); pick(tabs[j], true); }
    });
  });

  /* 3. walk the block checklist */
  var boxes = $$('.yd-chk input'), pins = $$('.yd-walk-pins i'), msg = $('#walk-msg');
  var lines = [
    'Tick what you can see from the ground or a window.',
    'One sign spotted. Worth asking a roofer to take a look. Keep your feet off the roof.',
    'A couple of signs together. A roofer can check what is going on up there. Photos from the ground help.',
    'Several signs at once. It is a good time to call a roofer. Stay off the roof and take photos from the ground.'
  ];
  function walk() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    pins.forEach(function (p, i) { p.classList.toggle('on', i < n); });
    msg.textContent = lines[n > 3 ? 3 : n];
  }
  boxes.forEach(function (b) { b.addEventListener('change', walk); });
})();
