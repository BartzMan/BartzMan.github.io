/* Yairo's Home Remodeling — pattern picker + work tabs */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- pattern picker ---------- */
  var PATTERNS = {
    herringbone: {
      name: "Herringbone",
      src: "images/pattern-herringbone.jpg",
      set: "images/pattern-herringbone-720.jpg 720w, images/pattern-herringbone.jpg 640w",
      w: 640, h: 699,
      alt: "White herringbone tile backsplash above a black counter",
      cap: "Zig-zag rows over the black counter",
      suit: "Rows of zig-zag brick, laid course by course — the pattern that makes a plain counter look deliberate. Sets fast off one line, reads rich in small rooms.",
      hint: "Suits: kitchen backsplashes \u00b7 shower floors \u00b7 entry ways"
    },
    mosaic: {
      name: "Mosaic",
      src: "images/pattern-mosaic.jpg",
      set: "images/pattern-mosaic-720.jpg 720w, images/pattern-mosaic.jpg 720w",
      w: 720, h: 836,
      alt: "Mosaic tile sheet forming a shower niche",
      cap: "Mosaic in the shower niche",
      suit: "Small stone squares on a mesh sheet — they bend around niches, curves and shower floors where big tile can't follow.",
      hint: "Suits: shower niches \u00b7 shower pans \u00b7 accent bands"
    },
    largeformat: {
      name: "Large format",
      src: "images/pattern-largeformat.jpg",
      set: "images/pattern-largeformat-720.jpg 720w, images/pattern-largeformat.jpg 1275w",
      w: 1275, h: 2048,
      alt: "Large-format grey tile lining a walk-in shower",
      cap: "Large format in the walk-in shower",
      suit: "Big field tile with tight joints — fewer lines, calmer walls. The hardest to set flat, and the cleanest when it is.",
      hint: "Suits: tub surrounds \u00b7 shower walls \u00b7 fireplace faces"
    },
    medallion: {
      name: "Medallion",
      src: "images/pattern-medallion.jpg",
      set: "images/pattern-medallion-720.jpg 720w, images/pattern-medallion.jpg 660w",
      w: 660, h: 740,
      alt: "Tile floor medallion taking shape on the subfloor",
      cap: "The medallion taking shape",
      suit: "An eight-point star cut in stone at the threshold — the floor's signature, laid where the room begins.",
      hint: "Suits: foyers \u00b7 living room floors \u00b7 doorway centers"
    }
  };

  var picker = $("#patterns");
  if (picker) {
    var btns = $$(".sw", picker);
    var stage = $(".stage", picker);
    var img = $("img", stage);
    var capSpan = $(".stage figcaption span", picker);
    var capB = $(".stage figcaption b", picker);
    var noteH = $(".pnotes h3", picker);
    var suitP = $(".pnotes .suit", picker);
    var hintP = $(".pnotes .hint", picker);
    var status = $("#pattern-live", picker);

    var show = function (key, btn) {
      var p = PATTERNS[key];
      if (!p) return;
      btns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      img.setAttribute("src", p.src);
      img.setAttribute("srcset", p.set);
      img.setAttribute("width", String(p.w));
      img.setAttribute("height", String(p.h));
      img.setAttribute("alt", p.alt);
      if (capSpan) capSpan.textContent = p.cap;
      if (capB) capB.textContent = p.name;
      if (noteH) noteH.textContent = p.name;
      if (suitP) suitP.textContent = p.suit;
      if (hintP) hintP.textContent = p.hint;
      if (status) status.textContent = p.name + " — photo and where it suits shown";
    };

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        show(btn.getAttribute("data-pat"), btn);
      });
    });
  }

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
      panels.forEach(function (p) {
        p.hidden = p.id !== tab.getAttribute("aria-controls");
      });
      tab.focus();
    };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { select(tab); });
    });

    tablist.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      if (n !== null) {
        e.preventDefault();
        select(tabs[n]);
      }
    });
  }
})();
