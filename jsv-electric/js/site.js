/* JSV Electric — Rockaway Current interactions */
(function () {
  "use strict";

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll(".jsv-rv");
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

  /* ---------- the flags ---------- */
  var flags = Array.prototype.slice.call(document.querySelectorAll(".jsv-flaghead"));
  flags.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var up = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", up ? "true" : "false");
      var post = btn.closest(".jsv-flagpost");
      if (post) post.classList.toggle("open", up);
      var hint = btn.querySelector(".jsv-flaghint");
      if (hint) hint.textContent = up ? hint.getAttribute("data-up") : hint.getAttribute("data-down");
      if (up) {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  /* ---------- the form ---------- */
  var form = document.getElementById("jsv-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector(".jsv-form-ok");
      ok.hidden = false;
      form.querySelector(".jsv-form-preview").hidden = false;
      var send = form.querySelector("button[type=submit]");
      send.disabled = true;
      send.setAttribute("aria-disabled", "true");
      ok.setAttribute("tabindex", "-1");
      ok.focus({ preventScroll: false });
    });
  }
})();
