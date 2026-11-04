/* Jiménez Pro Painting: concept interactions (fan deck chips, door before/after, finish picker) */
(function () {
  "use strict";

  /* 1. Fan deck: tap a chip to pull it out; the readout shows its swatches and where that colour family works */
  var chips = [
    ["JP-101", "Gulf Aqua", ["#bff0eb", "#7fe0d7", "#49d3c8", "#23a99f"], "Bright and cool: bedrooms, baths and kids' rooms that face the sun."],
    ["JP-102", "Sawhorse Walnut", ["#d9b38c", "#b07d52", "#7e522f", "#5a3a22"], "Wood stain tones: front doors, mantels and beams that show their grain."],
    ["JP-103", "Mantel Grey", ["#ffffff", "#eceae4", "#c9cbcc", "#8e98a3"], "Soft greys and whites: living rooms, hallways and trim around darker walls."],
    ["JP-104", "Prairie Sky", ["#d7e8f2", "#a9cde3", "#6fa7c9", "#3d7aa3"], "Sky blues: porch ceilings, siding and quiet bedrooms."],
    ["JP-105", "Brazos Clay", ["#ffd9cc", "#f7a98f", "#ef7a5a", "#c9553a"], "Warm clays: accent walls, front doors and dining rooms."],
    ["JP-106", "Gold Star", ["#fbebc0", "#f3d27a", "#e8b13a", "#b9851c"], "Sunny yellows: kitchens, breakfast nooks and laundry rooms."],
    ["JP-107", "Live Oak", ["#e3ecd9", "#bcd2a7", "#8fb07a", "#5f7f4e"], "Leafy greens: studies, bedrooms and shutters."],
    ["JP-108", "Star Iron", ["#c9c6cf", "#8f8a99", "#5b5666", "#2d2a33"], "Deep iron tones: front doors, railings and trim with contrast."]
  ];
  var tips = document.querySelectorAll(".fc-tip");
  var out = document.querySelector(".chip-readout");
  var pick = function (i) {
    tips.forEach(function (t) {
      var on = +t.getAttribute("data-chip") === i;
      t.setAttribute("aria-pressed", on ? "true" : "false");
      t.parentNode.classList.toggle("is-on", on);
    });
    if (!out) return;
    var c = chips[i];
    out.querySelector(".cr-n").textContent = c[0];
    out.querySelector(".cr-name").textContent = c[1];
    var sw = out.querySelector(".cr-swatches");
    c[2].forEach(function (col, k) { sw.style.setProperty("--s" + (k + 1), col); });
    out.querySelector(".cr-good").textContent = c[3];
  };
  tips.forEach(function (t) { t.addEventListener("click", function () { pick(+t.getAttribute("data-chip")); }); });

  /* 2. Front door before / after */
  var wipe = document.querySelector(".wipe");
  if (wipe) {
    var r = wipe.querySelector("input[type=range]");
    r.addEventListener("input", function () { wipe.style.setProperty("--w", r.value + "%"); });
  }

  /* 3. Which finish for which room */
  var rooms = [
    [0, "Flat", "Flat hides bumps and patch marks overhead, where nobody scrubs."],
    [2, "Eggshell (or matte)", "A soft low sheen that can take a wipe, without showing every roller mark on big walls."],
    [3, "Satin", "Steam and splashes: satin wipes clean and stands up to damp better than flatter finishes."],
    [4, "Semi-gloss", "Hands and shoes hit trim and doors all day; a harder, shinier finish cleans up easily."],
    [3, "Satin or low-lustre", "Siding usually gets a low-lustre or satin finish; trim and doors outside often go a step shinier."]
  ];
  var btns = document.querySelectorAll(".rm");
  var strip = document.querySelector(".sheen-strip");
  var so = document.querySelector(".sheen-out");
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var i = +b.getAttribute("data-room");
      btns.forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      if (strip) strip.style.setProperty("--pos", rooms[i][0]);
      if (so) { so.querySelector(".so-pick").textContent = rooms[i][1]; so.querySelector(".so-why").textContent = rooms[i][2]; }
    });
  });
})();
