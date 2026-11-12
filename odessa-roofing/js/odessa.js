/* Odessa Roofing — hail size guide, residential/commercial ledger tabs, storm checklist */
(function () {
  "use strict";

  /* ---- Hail size guide: material segments + size chips (signature) ---- */
  var stage = document.querySelector(".stage");
  if (stage) {
    var segs = stage.querySelectorAll(".seg-btn");
    var chips = stage.querySelectorAll(".chip");
    var live = stage.querySelector("[data-guide-live]");
    var sizeWord = { pea: "pea-size", quarter: "quarter-size", golf: "golf-ball", baseball: "baseball" };

    function announce() {
      var panel = stage.querySelector('.mat-panel[data-mat-panel="' + stage.dataset.mat + '"]');
      var name = panel && panel.dataset.label ? panel.dataset.label : "";
      if (live) {
        live.textContent = name + " \u2014 " + (sizeWord[stage.dataset.size] || stage.dataset.size) + " hail diagram shown";
      }
    }

    function setMat(v) {
      stage.dataset.mat = v;
      segs.forEach(function (b) {
        var on = b.dataset.mat === v;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      announce();
    }

    function setSize(v) {
      stage.dataset.size = v;
      chips.forEach(function (c) {
        var on = c.dataset.size === v;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      announce();
    }

    segs.forEach(function (b) {
      b.addEventListener("click", function () { setMat(b.dataset.mat); });
    });
    chips.forEach(function (c) {
      c.addEventListener("click", function () { setSize(c.dataset.size); });
    });
  }

  /* ---- Residential / Commercial ledger tabs ---- */
  var tabs = document.querySelectorAll(".sys-tab");
  function activateTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll(".sys-pane").forEach(function (p) {
      var on = p.id === tab.getAttribute("aria-controls");
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

  /* ---- "After a Basin hailstorm" checkbox ledger ---- */
  var boxes = document.querySelectorAll(".check-item input");
  var countEl = document.getElementById("ledger-count");
  var noteEl = document.getElementById("ledger-note");

  function updateLedger() {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    if (countEl) { countEl.textContent = n; }
    if (noteEl) {
      noteEl.textContent = n === 0
        ? "nothing logged yet"
        : n === boxes.length
          ? "the full picture \u2014 time to make the call"
          : (boxes.length - n) + " still to check";
    }
  }
  boxes.forEach(function (b) { b.addEventListener("change", updateLedger); });
})();
