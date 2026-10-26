(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- reveal on scroll (one-shot) ---- */
  var revealEls = document.querySelectorAll(".reveal, .ticks, .stamp, .notes");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add(e.target.classList.contains("notes") ? "in-view" : "in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- scroll progress + current tab ---- */
  var bar = document.querySelector(".progress i");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = doc.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var tabs = document.querySelectorAll(".tabs a");
  if ("IntersectionObserver" in window && tabs.length) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("on", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main > section[id]").forEach(function (s) { tio.observe(s); });
  }

  /* ---- phone menu ---- */
  var burger = document.querySelector(".burger");
  var sheet = document.getElementById("sheet");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    sheet.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger && sheet) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); burger.focus(); } });
  }

  /* ---- the lens: wood under the paper ---- */
  var paper = document.querySelector(".cover-paper");
  var lens = document.getElementById("lens");
  var zone = document.querySelector(".cover-lens-zone");
  if (paper && lens && zone) {
    var view = lens.querySelector(".lens-view");
    var size = 0, W = 0, H = 0, k = 1.25;
    var pos = { x: 0, y: 0 }, target = { x: 0, y: 0 }, raf = 0, dragging = false;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function paint() {
      lens.style.setProperty("--x", pos.x + "px");
      lens.style.setProperty("--y", pos.y + "px");
      var cx = (pos.x + size / 2) * k, cy = (pos.y + size / 2) * k;
      view.style.backgroundPosition = (size / 2 - cx) + "px " + (size / 2 - cy) + "px";
    }
    function home() {
      var p = paper.getBoundingClientRect(), z = zone.getBoundingClientRect();
      return {
        x: clamp(W > 700 ? z.left - p.left + (z.width - size) / 2 + 10 : z.left - p.left + 6, 0, W - size),
        y: clamp(z.top - p.top + (z.height - size) / 2 + (W > 900 ? 30 : -6), 0, H - size)
      };
    }
    function measure() {
      size = lens.offsetWidth;
      W = paper.clientWidth; H = paper.clientHeight;
      view.style.backgroundSize = Math.round(Math.max(W, H * 1600 / 1064) * k) + "px auto";
      var h = home(); pos.x = target.x = h.x; pos.y = target.y = h.y;
      paint();
    }
    function loop() {
      var dx = target.x - pos.x, dy = target.y - pos.y;
      pos.x += dx * 0.18; pos.y += dy * 0.18;
      paint();
      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) raf = requestAnimationFrame(loop); else raf = 0;
    }
    function aim(clientX, clientY) {
      var p = paper.getBoundingClientRect();
      target.x = clamp(clientX - p.left - size / 2, -size * 0.2, W - size * 0.8);
      target.y = clamp(clientY - p.top - size / 2, -size * 0.1, H - size * 0.9);
      if (reduce) { pos.x = target.x; pos.y = target.y; paint(); return; }
      if (!raf) raf = requestAnimationFrame(loop);
    }
    if (finePointer) {
      paper.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") aim(e.clientX, e.clientY); });
      paper.addEventListener("pointerleave", function () { var h = home(); target.x = h.x; target.y = h.y; if (!raf && !reduce) raf = requestAnimationFrame(loop); });
    }
    lens.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      dragging = true; lens.setPointerCapture(e.pointerId); aim(e.clientX, e.clientY);
    });
    lens.addEventListener("pointermove", function (e) { if (dragging) aim(e.clientX, e.clientY); });
    lens.addEventListener("pointerup", function () { dragging = false; });
    lens.addEventListener("pointercancel", function () { dragging = false; });
    lens.tabIndex = 0;
    lens.addEventListener("keydown", function (e) {
      var step = 30, m = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!m) return;
      e.preventDefault();
      target.x = clamp(pos.x + m[0], 0, W - size); target.y = clamp(pos.y + m[1], 0, H - size);
      pos.x = target.x; pos.y = target.y; paint();
    });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(measure, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener("load", measure);
    measure();
  }

  /* ---- evidence photos: hover lens ---- */
  if (finePointer) {
    document.querySelectorAll("[data-zoom]").forEach(function (box) {
      var img = box.querySelector("img");
      var z = document.createElement("span");
      z.className = "zoomlens";
      z.setAttribute("aria-hidden", "true");
      box.appendChild(z);
      box.addEventListener("pointerenter", function () { z.style.backgroundImage = "url(" + (img.currentSrc || img.src) + ")"; });
      box.addEventListener("pointermove", function (e) {
        var r = box.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        z.style.left = x + "px"; z.style.top = y + "px";
        z.style.backgroundPosition = (x / r.width * 100) + "% " + (y / r.height * 100) + "%";
      });
    });
  }

  /* ---- quote form: no backend yet ---- */
  var form = document.getElementById("quote");
  if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
})();
