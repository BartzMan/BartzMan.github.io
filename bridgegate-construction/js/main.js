/* Bridgegate Construction — SPAN interactions (design layer; kit.js does menus/bar/lightbox/reveals/form) */
(function () {
  "use strict";
  var d = document, qs = function (s, c) { return (c || d).querySelector(s); }, qsa = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  /* ---- THE SPAN: tap a bay plate, its load comes down on the cables ---- */
  var bays = qsa(".bay");
  function openBay(plate) {
    var bay = plate.closest(".bay");
    var panel = d.getElementById(plate.getAttribute("aria-controls"));
    var wasOpen = plate.getAttribute("aria-expanded") === "true";
    qsa(".bay-plate", bay.parentNode).forEach(function (p) { p.setAttribute("aria-expanded", "false"); });
    qsa(".bay-load", bay.parentNode).forEach(function (p) { p.classList.remove("open"); });
    if (!wasOpen) {
      plate.setAttribute("aria-expanded", "true");
      panel.classList.add("open");
      /* re-run the cable feed each open */
      var line = qs(".cable-line", panel);
      if (line) { line.style.animation = "none"; void line.getBoundingClientRect(); line.style.animation = ""; }
    }
  }
  bays.forEach(function (bay) {
    var plate = qs(".bay-plate", bay);
    plate.addEventListener("click", function () { openBay(plate); });
  });
  /* default: bay 01 hanging open (already set in markup) */

  /* ---- GROUND WALK: storm checklist plates unfold in order ---- */
  var steps = qsa(".step");
  function openStep(plate) {
    var body = d.getElementById(plate.getAttribute("aria-controls"));
    var wasOpen = plate.getAttribute("aria-expanded") === "true";
    qsa(".step-plate", plate.closest(".steps")).forEach(function (p) {
      p.setAttribute("aria-expanded", "false");
      p.parentElement.classList.remove("lit");
    });
    qsa(".step-body", plate.closest(".steps")).forEach(function (p) { p.classList.remove("open"); });
    if (!wasOpen) {
      plate.setAttribute("aria-expanded", "true");
      body.classList.add("open");
      plate.parentElement.classList.add("lit");
    }
  }
  steps.forEach(function (st) {
    var plate = qs(".step-plate", st);
    plate.addEventListener("click", function () { openStep(plate); });
  });
  /* step rivets on DOM-safe init */
  var s1 = qs("#stepBtn1");
  if (s1) { s1.parentElement.classList.add("lit"); }

  /* ---- TELEHANDLER GAUGE: boom extends with scroll, carries the load ---- */
  var member = qs("#boomGauge .boom-member");
  var load = qs("#boomLoad");
  var read = qs("#boomRead");
  var ticking = false;
  function gauge() {
    var doc = d.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var t = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop || 0) / max)) : 0;
    if (member) { member.setAttribute("width", String(Math.round(46 + 100 * t))); }
    if (load) { load.setAttribute("transform", "translate(" + (27 + 118 * t).toFixed(1) + " 0)"); }
    if (read) { read.textContent = Math.round(t * 100) + "%"; }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(gauge); } }, { passive: true });
  gauge();

  /* ---- hover craft: nothing needed -- all hover handled in CSS ---- */
})();
