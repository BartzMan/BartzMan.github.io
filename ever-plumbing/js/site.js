/* Ever Plumbing Underground — site behavior
   trace-the-line, plate toggles, depth gauge, reveals, work order */
(function () {
  "use strict";
  var d = document, w = window;

  d.documentElement.classList.add("js");

  /* ---------- strip shadow + depth gauge (scroll) ---------- */
  var strip = d.querySelector(".ev-strip");
  var drop = d.querySelector(".gauge-drop");
  var ticks = Array.prototype.slice.call(d.querySelectorAll(".gauge-tick"));
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = d.documentElement.scrollHeight - w.innerHeight;
      var frac = max > 0 ? Math.min(1, Math.max(0, (w.scrollY || d.documentElement.scrollTop || 0) / max)) : 0;
      var pct = frac * 100;
      if (drop) drop.style.top = pct.toFixed(2) + "%";
      ticks.forEach(function (t, i) { t.classList.toggle("passed", pct >= i * 12.5); });
      if (strip) strip.classList.toggle("scrolled", (w.scrollY || 0) > 10);
      ticking = false;
    });
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- trace the line ---------- */
  var cut = d.getElementById("evcut");
  var traceBtns = Array.prototype.slice.call(d.querySelectorAll(".trace-btn"));
  var paneWater = d.querySelector(".ti-water");
  var paneSewer = d.querySelector(".ti-sewer");
  var paneDefault = d.querySelector(".ti-default");

  function setTrace(which) {
    traceBtns.forEach(function (b) {
      var on = b.dataset.line === which && which !== "reset";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (cut) {
      cut.classList.toggle("is-water", which === "water");
      cut.classList.toggle("is-sewer", which === "sewer");
    }
    var info = d.getElementById("traceInfo");
    if (info) {
      info.classList.toggle("ti-water", which === "water");
      info.classList.toggle("ti-sewer", which === "sewer");
    }
    if (paneWater) paneWater.hidden = which !== "water";
    if (paneSewer) paneSewer.hidden = which !== "sewer";
    if (paneDefault) paneDefault.hidden = which === "water" || which === "sewer";
  }
  traceBtns.forEach(function (b) {
    b.addEventListener("click", function () { setTrace(b.dataset.line); });
  });

  /* ---------- specimen plates ---------- */
  Array.prototype.slice.call(d.querySelectorAll(".plate")).forEach(function (pl) {
    var top = pl.querySelector(".plate-top");
    var body = pl.querySelector(".plate-body");
    var hint = pl.querySelector(".plate-hint");
    if (!top || !body) return;
    top.addEventListener("click", function () {
      var open = top.getAttribute("aria-expanded") === "true";
      top.setAttribute("aria-expanded", String(!open));
      body.hidden = open;
      if (hint) hint.textContent = open ? "open" : "close";
    });
  });

  /* ---------- reveals ---------- */
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = Array.prototype.slice.call(d.querySelectorAll(
    ".ev-hero-copy,.ev-sitecard,.strata-copy,.strata-photo,.ev-cut,.trace-info," +
    ".plate,.log-row,.order-head,.ev-form,.bedrock-rating"
  ));
  if ("IntersectionObserver" in w && !reduce) {
    targets.forEach(function (t) { t.classList.add("rv"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- work order ---------- */
  var form = d.getElementById("evForm");
  var done = d.getElementById("evDone");
  var fields = ["ev-name", "ev-phone", "ev-msg"];

  function setBad(f, bad) { if (f) f.classList.toggle("is-bad", bad); }

  if (form && done) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var firstBad = null;
      fields.forEach(function (id) {
        var f = d.getElementById(id);
        if (!f) return;
        var ok = f.value.trim().length > 1;
        setBad(f, !ok);
        if (!ok && !firstBad) firstBad = f;
      });
      if (firstBad) { firstBad.focus(); return; }
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    fields.forEach(function (id) {
      var f = d.getElementById(id);
      if (f) f.addEventListener("input", function () { setBad(f, false); });
    });
  }
})();
