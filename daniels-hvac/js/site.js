/* daniels-hvac — site behaviors
   1. Season switch: flips the whole page between cooling and heating
      (body class + every .dm text node swaps its data-cool/data-heat copy)
   2. Scroll reveals (.dl-rv -> .in) + doodle draw-ins (.dl-draw)
   3. Request form: standard success pattern
*/
(function () {
  "use strict";
  var d = document;
  var qs = function (s, r) { return (r || d).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- 1. season switch ---------- */
  var btnCool = qs("#dl-btn-cool");
  var btnHeat = qs("#dl-btn-heat");
  var dms = qsa(".dm");

  function setMode(mode) {
    var heat = mode === "heat";
    d.body.classList.toggle("mode-heat", heat);
    d.body.classList.toggle("mode-cool", !heat);
    btnCool.setAttribute("aria-pressed", String(!heat));
    btnHeat.setAttribute("aria-pressed", String(heat));
    var key = heat ? "data-heat" : "data-cool";
    dms.forEach(function (el) {
      var val = el.getAttribute(key);
      if (val !== null) el.textContent = val;
    });
  }

  if (btnCool && btnHeat) {
    [btnCool, btnHeat].forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMode(btn.getAttribute("data-mode"));
      });
    });
  }

  /* ---------- 2. reveals + doodle draws ---------- */
  var rvs = qsa(".dl-rv");
  var draws = qsa(".dl-herovis, .dl-vent, .dl-call, .dl-foot");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.16 });
    rvs.forEach(function (el) { io.observe(el); });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("dl-draw"); io2.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    draws.forEach(function (el) { io2.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
    draws.forEach(function (el) { el.classList.add("dl-draw"); });
  }

  /* ---------- 3. form ---------- */
  var form = qs("#dl-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var ok = qs("#dl-form-ok");
      var prev = qs("#dl-form-preview");
      var btn = qs("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
      if (prev) prev.hidden = false;
      if (ok) {
        ok.hidden = false;
        ok.setAttribute("tabindex", "-1");
        ok.focus();
      }
    });
  }
})();
