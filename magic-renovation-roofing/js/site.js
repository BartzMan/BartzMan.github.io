/* Magic Renovation Roofing & Siding — site behaviour */
(function () {
  "use strict";
  var prm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- full-screen menu ---- */
  var burger = document.querySelector(".burger");
  var sheet = document.getElementById("sheet");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { sheet.hidden = false; document.body.style.overflow = "hidden"; }
    else { sheet.hidden = true; document.body.style.overflow = ""; }
  }
  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  sheet.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !sheet.hidden) setMenu(false);
  });

  /* ---- hero accent chips: repaint the site's accent ---- */
  document.querySelectorAll(".hchip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.documentElement.style.setProperty("--accent", chip.dataset.accent);
    });
  });

  /* ---- the sample board: chips repaint the drawn house ---- */
  var house = document.querySelector(".house");
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.setAttribute("aria-pressed", chip.classList.contains("is-on") ? "true" : "false");
    chip.addEventListener("click", function () {
      var group = chip.dataset.part === "roof" ? "roof" : "wall";
      document.querySelectorAll('.chip[data-part="' + group + '"]').forEach(function (c) {
        c.classList.remove("is-on");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-on");
      chip.setAttribute("aria-pressed", "true");
      house.style.setProperty(group === "roof" ? "--roof-c" : "--wall-c", chip.dataset.col);
    });
  });

  /* ---- courses: accordion of shingle rows ---- */
  document.querySelectorAll(".course-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var course = tab.closest(".course");
      var open = course.classList.contains("open");
      document.querySelectorAll(".course.open").forEach(function (c) {
        c.classList.remove("open");
        c.querySelector(".course-tab").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        course.classList.add("open");
        tab.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- lightbox ---- */
  var lb = document.getElementById("lb");
  var lbImg = lb.querySelector(".lb-img");
  var lbCap = lb.querySelector(".lb-cap");
  document.querySelectorAll("[data-lb]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lbImg.src = btn.dataset.src;
      lbImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "";
      lbCap.textContent = btn.dataset.cap || "";
      lb.showModal();
    });
  });
  lb.querySelector(".lb-x").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) {
    var r = lb.getBoundingClientRect();
    var inDialog = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inDialog) lb.close();
  });

  /* ---- scroll reveals ---- */
  var targets = [
    ".kicker", ".hero-copy h1", ".lede", ".cta-row", ".hero-chips", ".hero-photo",
    ".board-head", ".house-wrap", ".chips", ".board-tex", ".trades-head", ".trades-photo",
    ".trade-block", ".trades-mini", ".steps-head", ".course", ".ridge-head",
    ".rg", ".where-band", ".request-head", ".rate-wrap", ".quote"
  ];
  var revealEls = [];
  targets.forEach(function (sel, si) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("rv");
      if (i % 3 === 1) el.classList.add("d1");
      if (i % 3 === 2) el.classList.add("d2");
      revealEls.push(el);
    });
  });
  if (prm) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- chipline (scroll progress) ---- */
  var line = document.querySelector(".chipline");
  function chipline() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    line.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
  }
  if (!prm) {
    document.addEventListener("scroll", chipline, { passive: true });
    chipline();
  }

  /* ---- demo quote form ---- */
  var form = document.getElementById("quote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.innerHTML =
      '<div class="quote-head"><b>Request a quote</b><span>written down</span></div>' +
      '<p style="margin:8px 0 0;font-size:18px"><strong>Noted.</strong> Your request is written up on the board — we call or text back on the number you gave us.</p>' +
      '<p class="quote-note">Design preview — the form is connected to a live inbox before the site goes up.</p>';
  });
})();
