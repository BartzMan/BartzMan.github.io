/* Han Electric — site behavior
   the switch (lit/unlit), stations drawing on scroll, the wire-up form */
(function () {
  "use strict";
  var d = document, w = window;

  d.documentElement.classList.add("js");

  /* ---------- strip paper darkens on scroll ---------- */
  var strip = d.querySelector(".he-strip");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (strip) strip.classList.toggle("scrolled", (w.scrollY || d.documentElement.scrollTop || 0) > 10);
      ticking = false;
    });
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- the switch ---------- */
  var flip = d.getElementById("heFlip");
  if (flip) {
    flip.addEventListener("click", function () {
      var on = d.body.classList.toggle("lit");
      flip.setAttribute("aria-pressed", on ? "true" : "false");
      flip.textContent = on ? "Switch it back off" : "Flip the switch";
    });
  }

  /* ---------- stations draw in as they scroll into view ---------- */
  var stations = Array.prototype.slice.call(d.querySelectorAll(".he-station"));
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in w && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("drawn");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -6% 0px" });
    stations.forEach(function (s) { io.observe(s); });
  } else {
    stations.forEach(function (s) { s.classList.add("drawn"); });
  }

  /* ---------- the wire-up ---------- */
  var form = d.getElementById("heForm");
  var done = d.getElementById("heDone");
  var fields = ["he-name", "he-phone", "he-msg"];

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
