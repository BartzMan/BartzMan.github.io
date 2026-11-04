/* S&L Roofing & Contractors: concept interactions (shingle-or-metal tabs, read-your-roof signs) */
(function () {
  "use strict";

  /* 1. Shingle or metal: tab between the two roof types */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".cc-tab"));
  var select = function (t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
      var pane = document.getElementById(x.getAttribute("aria-controls"));
      if (pane) { pane.hidden = !on; pane.classList.toggle("is-on", on); }
    });
  };
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        select(n); n.focus();
      }
    });
  });

  /* 2. Read your roof: tap a sign to circle it on the roof face */
  var signs = document.querySelectorAll(".sign");
  var marks = document.querySelectorAll(".mark");
  var show = function (i) {
    signs.forEach(function (b) { var on = +b.getAttribute("data-sign") === i; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    marks.forEach(function (m) { m.classList.toggle("is-on", +m.getAttribute("data-sign") === i); });
  };
  signs.forEach(function (b) { b.addEventListener("click", function () { show(+b.getAttribute("data-sign")); }); });
  marks.forEach(function (m) { m.addEventListener("click", function () { show(+m.getAttribute("data-sign")); }); });
  show(0);
})();
