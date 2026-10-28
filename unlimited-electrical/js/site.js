/* Unlimited electrical solutions group — neon wall interactions */
(function () {
  "use strict";

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll(".ue-rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- sign segments power the wall ---------- */
  var segs = Array.prototype.slice.call(document.querySelectorAll(".ue-seg[data-target]"));

  function syncWall() {
    var anyOn = segs.some(function (s) { return s.getAttribute("aria-pressed") === "true"; });
    document.body.classList.toggle("ue-powered", anyOn);
  }

  segs.forEach(function (seg) {
    seg.addEventListener("click", function () {
      var on = seg.getAttribute("aria-pressed") !== "true";
      seg.setAttribute("aria-pressed", on ? "true" : "false");
      var sec = document.getElementById(seg.getAttribute("data-target"));
      var cab = sec ? sec.querySelector(".ue-cabinet") : null;
      if (cab) {
        cab.classList.toggle("ue-lit", on);
        if (on) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      syncWall();
    });
  });

  /* ---------- the form ---------- */
  var form = document.getElementById("ue-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector(".ue-form-ok");
      ok.hidden = false;
      form.querySelector(".ue-form-preview").hidden = false;
      var send = form.querySelector("button[type=submit]");
      send.disabled = true;
      send.setAttribute("aria-disabled", "true");
      ok.setAttribute("tabindex", "-1");
      ok.focus({ preventScroll: false });
    });
  }
})();
