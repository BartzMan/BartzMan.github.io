/* Twin Eagle Roofing — EAGLE'S EYE interactions (design layer; kit.js does menus/bar/lightbox/reveals/form) */
(function () {
  "use strict";
  var d = document, qs = function (s, c) { return (c || d).querySelector(s); }, qsa = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  /* ---- THE DIVE: tap a plan shape, its stop panel comes into view ---- */
  function closeAllStops() {
    qsa(".shape").forEach(function (p) { p.setAttribute("aria-expanded", "false"); });
    qsa(".stop-panel").forEach(function (p) {
      p.classList.remove("open");
      p.setAttribute("aria-hidden", "true");
    });
  }
  function openStop(n, panelBtn) {
    closeAllStops();
    var btn = panelBtn || qs("#shapeBtn" + n);
    var panel = d.getElementById("shapePanel" + n);
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", "true");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }
  qsa(".shape").forEach(function (shape) {
    shape.addEventListener("click", function () {
      var wasOpen = shape.getAttribute("aria-expanded") === "true";
      if (wasOpen) return; /* the open stop is already showing: nothing to swap */
      openStop(shape.getAttribute("aria-controls").replace("shapePanel", ""), shape);
    });
  });

  /* ---- triage cards "jump to stop": open the destination stop, then scroll there ---- */
  qsa(".to-stop").forEach(function (link) {
    link.addEventListener("click", function () {
      var n = link.getAttribute("data-stop");
      if (n) openStop(n, qs("#shapeBtn" + n));
    });
  });

  /* ---- ROOF TRIAGE: symptom cards unfold in order ---- */
  function openSymptom(plate) {
    var body = d.getElementById(plate.getAttribute("aria-controls"));
    var wasOpen = plate.getAttribute("aria-expanded") === "true";
    qsa(".triage-plate", plate.closest(".triage-list")).forEach(function (p) { p.setAttribute("aria-expanded", "false"); });
    qsa(".triage-body", plate.closest(".triage-list")).forEach(function (p) { p.classList.remove("open"); });
    if (!wasOpen) {
      plate.setAttribute("aria-expanded", "true");
      body.classList.add("open");
    }
  }
  qsa(".triage-plate").forEach(function (plate) {
    plate.addEventListener("click", function () { openSymptom(plate); });
  });

  /* ---- ALTITUDE RAIL: marker + readout fall 12,000 -> 40 FT with the page ---- */
  var marker = qs(".alt-marker"), read = qs("#altRead");
  var ticking = false;
  function rail() {
    ticking = false;
    if (!marker && !read) return;
    var doc = d.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var t = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop || 0) / max)) : 0;
    if (marker && marker.parentElement) {
      /* keep the disc inside the track at both ends */
      var run = marker.parentElement.offsetHeight - marker.offsetHeight;
      marker.style.top = (Math.round(run * t)) + "px";
    }
    if (read) {
      var ft = Math.round(12000 - 11960 * t);
      read.textContent = "ALT " + ft.toLocaleString("en-US");
    }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(rail); } }, { passive: true });
  window.addEventListener("resize", rail);
  rail();
})();
