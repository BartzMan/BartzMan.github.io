(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var mq = window.matchMedia('(max-width: 900px)');

  /* repair chest: tap a drawer, it slides open */
  var stage = $('#stage');
  var drawers = $$('.drawer');
  var home = stage && stage.parentNode;
  function place(btn) {
    if (!stage) return;
    if (mq.matches) { btn.parentNode.appendChild(stage); }
    else if (stage.parentNode !== home) { home.appendChild(stage); }
  }
  function open(btn, user) {
    drawers.forEach(function (b) { b.setAttribute('aria-expanded', String(b === btn)); });
    $$('.panel', stage).forEach(function (p) {
      var on = p.id === btn.getAttribute('aria-controls');
      p.hidden = !on;
      p.classList.remove('slide');
      if (on && user) { void p.offsetWidth; p.classList.add('slide'); }
    });
    place(btn);
    if (user && mq.matches) { setTimeout(function () { var r = btn.getBoundingClientRect(); if (r.top < 70 || r.top > window.innerHeight * .6) window.scrollTo({ top: window.scrollY + r.top - 90, behavior: 'smooth' }); }, 60); }
  }
  drawers.forEach(function (b) { b.addEventListener('click', function () { open(b, true); }); });
  function current() { return drawers.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0] || drawers[0]; }
  mq.addEventListener('change', function () { place(current()); });
  if (drawers.length) place(current());

  /* room picker */
  var tabs = $$('.rtab');
  function pick(t, user) {
    tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
    $$('.rpanel').forEach(function (p) {
      var on = p.id === t.getAttribute('aria-controls');
      p.hidden = !on; p.classList.remove('slide');
      if (on && user) { void p.offsetWidth; p.classList.add('slide'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { pick(t, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = -1;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n > -1) { e.preventDefault(); tabs[n].focus(); pick(tabs[n], true); }
    });
  });

  /* four checks */
  var steps = $$('.step');
  var count = $('#pcount'), bar = $('#pbar'), end = $('#pend');
  function tally() {
    var n = steps.filter(function (s) { return s.classList.contains('done'); }).length;
    count.textContent = n + ' of 4 checked';
    bar.style.setProperty('--p', (n * 25) + '%'); bar.parentNode.style.setProperty('--p', (n * 25) + '%');
    bar.style.width = (n * 25) + '%';
    end.textContent = n === 4 ? 'All four checked. If the stain or soft spot is still there, call or WhatsApp us and describe what you found.' : 'Not sure what you are looking at? Describe it to us by phone or WhatsApp.';
  }
  steps.forEach(function (s) {
    s.addEventListener('click', function () {
      var open = s.getAttribute('aria-expanded') === 'true';
      if (!open) { s.setAttribute('aria-expanded', 'true'); s.classList.add('done'); }
      else if (s.classList.contains('done')) { s.classList.remove('done'); s.setAttribute('aria-expanded', 'false'); }
      else { s.classList.add('done'); }
      tally();
    });
  });
  tally();
})();
