/* G & R Welding and Fencing — gate builder + gates/fences/pavilions tabs */
(function () {
  "use strict";

  /* ---- BUILD YOUR GATE: style rail swaps photo, caption and build notes ---- */
  var STYLES = {
    ranch: {
      name: "Ranch gate",
      title: "What a ranch gate needs",
      src: "images/gate-ranch.jpg",
      src720: "images/gate-ranch-720.jpg",
      w: 1600, h: 1200,
      alt: "Steel ranch gate frame spanning a driveway between two posts",
      cap: "A steel ranch gate frame across a driveway opening",
      live: "Ranch gate \u2014 photo and build notes shown",
      parts: {
        frame: "Square-tube steel frame with a diagonal brace \u2014 the shape that keeps a wide gate square as it swings.",
        posts: "Heavy steel posts set deep in concrete footings, sized for the span and the wind.",
        hinges: "Adjustable barrel hinges with grease points \u2014 heavy enough to carry the leaf without sag.",
        latch: "A two-way latch that works from the saddle side or from the porch.",
        finish: "Primed and painted in the color you pick, or bare steel left to weather dark."
      }
    },
    woodsteel: {
      name: "Wood & steel gate",
      title: "What a wood & steel gate needs",
      src: "images/gate-woodsteel.jpg",
      src720: "images/gate-woodsteel-720.jpg",
      w: 1600, h: 1200,
      alt: "Wood-and-steel gate with cedar pickets set in a welded steel frame",
      cap: "Cedar pickets carried in a welded steel frame",
      live: "Wood and steel gate \u2014 photo and build notes shown",
      parts: {
        frame: "A welded steel skeleton that carries the weight so the wood never has to.",
        posts: "Steel line posts in concrete, tall enough to hold the frame clear of the ground.",
        hinges: "Wide-throw hinges so the leaf swings level with a full set of pickets.",
        latch: "A drop rod or a heavy thumb latch, matched to how the gate is used.",
        finish: "Cedar sealed against the sun; steel painted to sit quiet against the wood."
      }
    },
    privacy: {
      name: "Privacy gate",
      title: "What a privacy gate needs",
      src: "images/gate-privacy.jpg",
      src720: "images/gate-privacy-720.jpg",
      w: 960, h: 1200,
      alt: "Steel privacy fence panels closing off a property line",
      cap: "Steel privacy panels closed across a fence line",
      live: "Privacy gate \u2014 photo and build notes shown",
      parts: {
        frame: "A full-height steel frame with a solid infill \u2014 nothing to see through.",
        posts: "Posts set deep and plumbed, because a privacy leaf carries real weight.",
        hinges: "Heavy knuckle hinges spread tall to carry a full sheet of steel or wood.",
        latch: "A positive latch \u2014 or a keyed one, for yards that need to stay closed.",
        finish: "Solid-color paint or powder coat; wood infill stained to meet the fence line."
      }
    },
    pool: {
      name: "Pool gate",
      title: "What a pool gate needs",
      src: "images/gate-pool.jpg",
      src720: "images/gate-pool-720.jpg",
      w: 1250, h: 1200,
      alt: "Pool fence gate between a deck and a backyard",
      cap: "A pool fence gate between the deck and the yard",
      live: "Pool gate \u2014 photo and build notes shown",
      parts: {
        frame: "A light, open frame built around pool-barrier rules \u2014 climb-resistant and see-through.",
        posts: "Slim posts anchored into the deck or set in concrete at the fence line.",
        hinges: "Self-closing hinges, so the gate swings shut behind whoever walks through.",
        latch: "Self-latching hardware set high, out of the reach of small hands.",
        finish: "Black or bronze frame and mesh \u2014 colors that disappear against the yard."
      }
    }
  };

  var rail = document.querySelector(".style-rail");
  if (rail) {
    var btns = rail.querySelectorAll(".style-btn");
    var photo = document.querySelector(".gate-photo img");
    var capL = document.querySelector(".gate-photo figcaption span");
    var capB = document.querySelector(".gate-photo figcaption b");
    var title = document.getElementById("parts-title");
    var live = document.getElementById("gate-live");
    var partEls = {};
    document.querySelectorAll(".parts-list p[data-part]").forEach(function (p) {
      partEls[p.dataset.part] = p;
    });

    function apply(key) {
      var s = STYLES[key];
      if (!s) { return; }
      btns.forEach(function (b) {
        var on = b.dataset.style === key;
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (photo) {
        photo.src = s.src;
        photo.srcset = s.src720 + " 720w, " + s.src + " " + s.w + "w";
        photo.sizes = "(max-width: 1020px) 92vw, 560px";
        photo.width = s.w;
        photo.height = s.h;
        photo.alt = s.alt;
      }
      if (capL) { capL.textContent = s.cap; }
      if (capB) { capB.textContent = s.name; }
      if (title) { title.textContent = s.title; }
      Object.keys(s.parts).forEach(function (k) {
        if (partEls[k]) { partEls[k].textContent = s.parts[k]; }
      });
      if (live) { live.textContent = s.live; }
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.dataset.style); });
    });
  }

  /* ---- THE WORK: gates / fences / pavilions tabs (roving focus, arrow keys) ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function activateTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var pane = document.getElementById(t.getAttribute("aria-controls"));
      if (pane) {
        if (on) { pane.removeAttribute("hidden"); } else { pane.setAttribute("hidden", ""); }
      }
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
