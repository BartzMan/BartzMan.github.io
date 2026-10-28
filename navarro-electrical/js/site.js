/* navarro-electrical: site behaviors
   1. Floor plan: tap/arrow a room -> symbols light up, wires draw, readout swaps, form picks the room
   2. Develop buttons turn the blueprint prints to colour
   3. Scroll reveals + stamp-ins
   4. Work-order form: standard success pattern
*/
(function () {
  "use strict";
  var d = document;
  var qs = function (s, r) { return (r || d).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- 1. floor plan ---------- */
  var plan = qs("#nv-planbox");
  var btns = qsa(".nv-rbtn");
  var rooms = qsa(".nv-room");
  var sel = qs("#nv-roomsel");

  function setRoom(slug, focus) {
    if (!plan) return;
    plan.setAttribute("data-room", slug);
    btns.forEach(function (b) {
      var on = b.getAttribute("data-room") === slug;
      b.setAttribute("aria-pressed", String(on));
      if (on && focus) b.focus();
    });
    rooms.forEach(function (r) { r.hidden = r.id !== "nv-r-" + slug; });
    if (sel) sel.value = slug;
  }

  btns.forEach(function (b, i) {
    b.addEventListener("click", function () { setRoom(b.getAttribute("data-room"), false); });
    b.addEventListener("keydown", function (ev) {
      var n = btns.length, j = -1;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") j = (i + 1) % n;
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") j = (i - 1 + n) % n;
      else if (ev.key === "Home") j = 0;
      else if (ev.key === "End") j = n - 1;
      if (j > -1) { ev.preventDefault(); setRoom(btns[j].getAttribute("data-room"), true); }
    });
  });

  /* ---------- 2. develop prints ---------- */
  qsa(".nv-dev").forEach(function (b) {
    b.addEventListener("click", function () {
      var fig = b.closest(".nv-print");
      var on = !fig.classList.contains("is-dev");
      fig.classList.toggle("is-dev", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "Back to blueprint" : "Develop";
    });
  });

  /* ---------- 3. reveals + stamps ---------- */
  var rvs = qsa(".nv-rv, .nv-stampt.nv-st");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 4. form ---------- */
  var form = qs("#nv-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var ok = qs("#nv-form-ok");
      var prev = qs("#nv-form-preview");
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
