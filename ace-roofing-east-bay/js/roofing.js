/* Ace Roofing East Bay — roof-type switch + repair/replace tabs */
(function () {
  "use strict";

  /* ---- Flat / pitched switch (signature) ---- */
  var swBtns = document.querySelectorAll(".sw-btn");
  function setSystem(v) {
    swBtns.forEach(function (b) {
      var on = b.dataset.sys === v;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll("[data-sys-panel]").forEach(function (p) {
      var on = p.dataset.sysPanel === v;
      p.classList.toggle("is-on", on);
      if (on) { p.removeAttribute("hidden"); } else { p.setAttribute("hidden", ""); }
    });
  }
  swBtns.forEach(function (b) {
    b.addEventListener("click", function () { setSystem(b.dataset.sys); });
  });

  /* ---- Repair / Replace tabs ---- */
  var tabs = document.querySelectorAll(".tab");
  function activateTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll(".tab-pane").forEach(function (p) {
      var on = p.id === "pane-" + tab.id.replace("tab-", "");
      p.classList.toggle("is-on", on);
      if (on) { p.removeAttribute("hidden"); } else { p.setAttribute("hidden", ""); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { activateTab(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        activateTab(next);
      }
    });
  });
})();
