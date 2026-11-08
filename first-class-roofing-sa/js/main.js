/* FIRST CLASS MAIL — concept interactions only.
   kit.js already owns: menu sheet, sticky bar, lightbox, reveals,
   nav highlight, form preview, scroll variable, year.
   This file owns: postcard flips, postal-route tabs, the route
   cancel that settles when the route is read. */

(function () {
  'use strict';

  /* 1 — Postcard flips: tap (or Enter) a postcard to turn it over
        and read the service on the back. Both faces carry a toggle
        button, so the card is fully operable by keyboard and touch. */
  document.querySelectorAll('[data-flip]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.stamp-card');
      if (!card) return;
      var open = card.classList.toggle('is-open');
      card.querySelectorAll('[data-flip]').forEach(function (b) {
        b.setAttribute('aria-pressed', open ? 'true' : 'false');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      var back = card.querySelector('.flip-back');
      if (back) back.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });

  /* 2 — Postal-route tabs: tap a stop to open its parcel card.
        Works with mouse, touch and arrow keys (roving tablist). */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.route-stop'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.route-panel'));

  function selectStop(tab, focus) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-open', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (p) {
      var show = p.id === tab.getAttribute('data-stop');
      p.classList.toggle('is-open', show);
      p.hidden = !show;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectStop(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectStop(next, true); }
    });
  });
  if (tabs.length) tabs.forEach(function (t) { t.tabIndex = t.classList.contains('is-open') ? 0 : -1; });

  /* 3 — The route cancel settles (stamps in) the first time the
        postal route is seen, and the contact postmark follows. */
  var stampTargets = document.querySelectorAll('.route-cancel, .postmark-giant');
  if ('IntersectionObserver' in window && stampTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-stamped');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    stampTargets.forEach(function (t) { io.observe(t); });
  } else {
    stampTargets.forEach(function (t) { t.classList.add('is-stamped'); });
  }
})();
