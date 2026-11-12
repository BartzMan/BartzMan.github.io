/* Valenzuela Painting — chip deck repaint + work tabs */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- chip deck: choose a part, then tap a chip ---------- */
  var house = $("#house");
  var caption = $("#house-caption");
  var partBtns = $$(".part");
  var cards = $$(".chipcard");
  var LABEL = { body: "Body", trim: "Trim", door: "Door", accent: "Shutters" };
  var current = "body";
  var picked = { body: "Redwood Bark", trim: "Marina White", door: "Skyline Ochre", accent: "Bay Blue" };
  var info = {};
  cards.forEach(function (c) {
    info[c.getAttribute("data-name")] = { colour: c.getAttribute("data-colour"), place: c.getAttribute("data-place") };
  });

  function sync() {
    partBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-part") === current ? "true" : "false"); });
    cards.forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-name") === picked[current]); });
  }
  function say() {
    var n = picked[current];
    if (caption) caption.textContent = LABEL[current] + ": " + n + " — " + info[n].place + ".";
  }
  function paint(part, name) {
    picked[part] = name;
    if (house) house.style.setProperty("--" + part, info[name].colour);
  }
  partBtns.forEach(function (b) {
    b.addEventListener("click", function () { current = b.getAttribute("data-part"); sync(); say(); });
  });
  cards.forEach(function (c) {
    c.addEventListener("click", function () { paint(current, c.getAttribute("data-name")); sync(); say(); });
  });
  if (house) {
    house.addEventListener("click", function (e) {
      var t = e.target;
      if (!t.closest) return;
      var p = t.closest(".pb") ? "body" : t.closest(".pd") ? "door" : t.closest(".pa") ? "accent" : (t.closest(".pt") || t.closest(".pt-s")) ? "trim" : null;
      if (p) { current = p; sync(); say(); }
    });
    Object.keys(picked).forEach(function (k) { paint(k, picked[k]); });
  }
  sync();

  /* ---------- work tabs ---------- */
  var tablist = $("[role=tablist]");
  if (tablist) {
    var tabs = $$("[role=tab]", tablist);
    var panels = $$("[role=tabpanel]");
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
      tab.focus();
    };
    tabs.forEach(function (tab) { tab.addEventListener("click", function () { select(tab); }); });
    tablist.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); select(tabs[n]); }
    });
  }
})();
