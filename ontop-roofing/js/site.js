(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  // hero: roof lays in from the eave, the name drops onto the ridge (one shot)
  requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add("loaded"); }); });

  // mobile full-screen menu
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { menu.hidden = false; document.body.style.overflow = "hidden"; }
    else { menu.hidden = true; document.body.style.overflow = ""; }
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });
  }

  // cutaway drawing: shingle courses, chalk lines and ridge caps
  var courses = document.getElementById("courses");
  if (courses) {
    var x0 = 220, x1 = 620, top = 54, bottom = 392, h = 26, row = 0;
    var tones = ["#7f6244", "#866848", "#76593d", "#6c5038"];
    for (var y = bottom - h; y >= top; y -= h, row++) {
      var g = document.createElementNS(NS, "g");
      var off = (row * 17) % 41;
      var widths = [34, 52, 26, 44, 60, 38, 30, 48];
      for (var x = x0 - off, k = row * 3; x < x1; k++) {
        var tw = widths[k % widths.length];
        var r = document.createElementNS(NS, "rect");
        var xs = Math.max(x, x0), xe = Math.min(x + tw - 2, x1);
        x += tw;
        if (xe - xs < 2) continue;
        r.setAttribute("x", xs); r.setAttribute("y", y);
        r.setAttribute("width", xe - xs); r.setAttribute("height", h + 4);
        r.setAttribute("fill", tones[(k * 5 + row) % 4]);
        r.setAttribute("class", "c");
        r.style.transitionDelay = (1.0 + row * 0.09) + "s";
        g.appendChild(r);
      }
      var s = document.createElementNS(NS, "rect");
      s.setAttribute("x", x0); s.setAttribute("y", y + h); s.setAttribute("width", x1 - x0); s.setAttribute("height", 3);
      s.setAttribute("fill", "#000"); s.setAttribute("opacity", ".35"); s.setAttribute("class", "c");
      s.style.transitionDelay = (1.0 + row * 0.09) + "s";
      g.appendChild(s);
      courses.appendChild(g);
    }
    var chalks = document.getElementById("chalks");
    for (var cy = bottom - h * 3; cy > top + 10; cy -= h * 4) {
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", 200); l.setAttribute("x2", 636); l.setAttribute("y1", cy); l.setAttribute("y2", cy);
      l.setAttribute("stroke", "#7ea6ff"); l.setAttribute("stroke-width", "2"); l.setAttribute("stroke-dasharray", "6 2 3 2");
      chalks.appendChild(l);
    }
    var caps = document.getElementById("caps");
    for (var cx = 220; cx < 620; cx += 30) {
      var c = document.createElementNS(NS, "rect");
      c.setAttribute("x", cx); c.setAttribute("y", 30); c.setAttribute("width", Math.min(28, 620 - cx)); c.setAttribute("height", 24);
      c.setAttribute("rx", 2); c.setAttribute("fill", "#2f373f"); c.setAttribute("stroke", "#11151a");
      caps.appendChild(c);
    }
  }

  // one-shot reveals
  var targets = document.querySelectorAll(".reveal, [data-chalk], [data-build]");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (t) { t.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  // quote form: preview only
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".bundle__ok");
      var name = form.elements.name, phone = form.elements.phone;
      if (!name.value.trim() || !phone.value.trim()) {
        ok.textContent = "Please add your name and a phone number so we can reply.";
        (name.value.trim() ? phone : name).focus();
        return;
      }
      ok.textContent = "Thanks, " + name.value.trim().split(" ")[0] + ". This form is a preview on this demo page: to reach On Top Roofing today, call or text (567) 279-3430.";
    });
  }
})();
