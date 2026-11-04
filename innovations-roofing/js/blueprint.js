/* Innovations Roofing & Remodeling: concept interactions
   1 elevation drawn -> built (slider + scroll), 2 roof layers, 3 kitchen plan spots, 4 after-storm redlines */
(function () {
  "use strict";

  /* 1. Front elevation: the drawing fills in with the photo as you scroll; the slider takes over once touched */
  var elev = document.querySelector(".elev");
  if (elev) {
    var range = elev.querySelector("input[type=range]");
    var touched = false;
    var set = function (v) { elev.style.setProperty("--split", v + "%"); if (range) range.value = v; };
    if (range) {
      range.addEventListener("input", function () { touched = true; set(+range.value); });
    }
    var onScroll = function () {
      if (touched) return;
      var r = elev.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.6)));
      set(Math.round(20 + p * 70));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 2. Roof section: tap a layer to highlight it and read what it does */
  var notes = [
    ["Decking.", "The plywood or OSB boards the whole roof sits on. On a replacement, soft or rotted boards only show once the old roof is off."],
    ["Underlayment.", "A water-resistant sheet under the shingles: a second line of defence when wind drives rain under them."],
    ["Shingles.", "Laid in overlapping courses from the eave up, each one covering the nails of the one below it, so rain runs over and off."],
    ["Drip edge.", "Metal along the roof edge that steers water off into the gutter instead of behind it onto the fascia."],
    ["Ridge vent.", "A vent along the peak that lets hot attic air out, which matters under a Houston summer sun."]
  ];
  var svg = document.querySelector(".sect-svg");
  var tabs = document.querySelectorAll(".lt");
  var note = document.querySelector(".layer-note");
  var pick = function (i) {
    tabs.forEach(function (t) { var on = +t.getAttribute("data-layer") === i; t.classList.toggle("is-on", on); t.setAttribute("aria-pressed", on ? "true" : "false"); });
    if (svg) {
      svg.classList.add("has-hi");
      svg.querySelectorAll(".ly").forEach(function (g) { g.classList.toggle("is-hi", +g.getAttribute("data-layer") === i); });
      svg.querySelectorAll(".bub").forEach(function (g) { g.classList.toggle("is-hi", +g.getAttribute("data-for") === i); });
    }
    if (note) { note.querySelector("b").textContent = notes[i][0]; note.querySelector("span").textContent = notes[i][1]; }
  };
  tabs.forEach(function (t) { t.addEventListener("click", function () { pick(+t.getAttribute("data-layer")); }); });
  if (svg) {
    svg.querySelectorAll(".ly,.bub").forEach(function (g) {
      g.style.cursor = "pointer";
      g.addEventListener("click", function () { pick(+(g.getAttribute("data-layer") || g.getAttribute("data-for"))); });
    });
    pick(2);
  }

  /* 3. Kitchen plan: tap a spot for the decision made there */
  var zoneNotes = [
    ["Island.", "Leave enough walkway around an island for two people to pass and for the dishwasher and oven doors to open all the way."],
    ["Sink wall.", "Moving a sink means moving water and drain lines; keeping it where it is usually keeps a remodel simpler."],
    ["Range.", "A range needs the right power or gas line and a hood vented the right way: settle this before cabinets are ordered."],
    ["Lighting.", "Plan it in layers: recessed lights for the room, pendants over the island, under-cabinet lights for the counters."]
  ];
  var zones = document.querySelectorAll(".pz");
  var pnote = document.querySelector(".plan-note");
  zones.forEach(function (z) {
    z.addEventListener("click", function () {
      var i = +z.getAttribute("data-zone");
      zones.forEach(function (q) { q.classList.toggle("is-on", q === z); q.setAttribute("aria-pressed", q === z ? "true" : "false"); });
      if (pnote) { pnote.querySelector("b").textContent = zoneNotes[i][0]; pnote.querySelector("span").textContent = zoneNotes[i][1]; }
    });
  });

  /* 4. After a storm: tap a check to circle it on the elevation */
  var rls = document.querySelectorAll(".rl");
  var clouds = document.querySelectorAll(".cloud");
  var showCloud = function (i) {
    rls.forEach(function (b) { var on = +b.getAttribute("data-cloud") === i; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    clouds.forEach(function (c) { c.classList.toggle("is-on", +c.getAttribute("data-cloud") === i); });
  };
  rls.forEach(function (b) { b.addEventListener("click", function () { showCloud(+b.getAttribute("data-cloud")); }); });
  clouds.forEach(function (c) { c.style.cursor = "pointer"; c.addEventListener("click", function () { showCloud(+c.getAttribute("data-cloud")); }); });
  showCloud(0);
})();
