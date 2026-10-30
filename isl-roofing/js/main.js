(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- phone menu ---- */
  var menu = document.getElementById("menu");
  var openBtn = document.querySelector(".menu-btn");
  var closeBtn = menu ? menu.querySelector(".menu-close") : null;

  function openMenu() {
    menu.hidden = false;
    document.body.classList.add("menu-open");
    openBtn.setAttribute("aria-expanded", "true");
    var first = menu.querySelector(".menu-links a");
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    menu.hidden = true;
    document.body.classList.remove("menu-open");
    openBtn.setAttribute("aria-expanded", "false");
    if (returnFocus) openBtn.focus();
  }
  if (menu && openBtn) {
    openBtn.addEventListener("click", function () { if (menu.hidden) openMenu(); else closeMenu(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { closeMenu(true); });
    menu.addEventListener("click", function (e) {
      if (e.target === menu) closeMenu(true);
      if (e.target.closest && e.target.closest("a")) closeMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) closeMenu(true);
    });
  }

  /* ---- reveal + flight lines ---- */
  var watched = document.querySelectorAll(".reveal, .seam:not(.seam-static), .anatomy");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- scroll progress: one long flight line ---- */
  var bar = document.querySelector(".flight-progress-bar");
  if (bar) {
    var ticking = false;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.setProperty("--p", p.toFixed(4));
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---- custom cursor: a hot flight tip, fine pointers only ---- */
  var cur = document.querySelector(".cursor");
  if (cur && !reduce && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var x = 0, y = 0, raf = null;
    var move = function () { cur.style.transform = "translate(" + x + "px," + y + "px)"; raf = null; };
    document.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      cur.classList.add("on");
      if (!raf) raf = window.requestAnimationFrame(move);
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cur.classList.remove("on"); });
    document.addEventListener("mouseover", function (e) {
      var hit = e.target.closest && e.target.closest("a, button, select, input, textarea, .sheet, .frame");
      cur.classList.toggle("big", !!hit);
    });
  } else if (cur) {
    cur.remove();
  }

  /* ---- roof note form: demo form, handled by sc-form.js (no mail client is opened) ---- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  }
})();
