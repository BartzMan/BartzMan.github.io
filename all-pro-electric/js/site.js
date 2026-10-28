/* ALL PRO ELECTRIC — playbook interactions */
(function () {
  "use strict";

  /* ---------- hero: run the play ---------- */
  var snap = document.querySelector(".pk-snap");
  var snapBtn = document.getElementById("snapBtn");
  var snapRead = document.getElementById("snapRead");
  var snaps = ["QUICK SLANT", "POWER SWEEP", "PLAY ACTION"];
  var n = 0;
  if (snapBtn && snap) {
    snapBtn.addEventListener("click", function () {
      snap.classList.remove("run");
      void snap.offsetWidth; /* reflow so routes redraw */
      snap.classList.add("run");
      n = (n + 1) % snaps.length;
      snapRead.textContent = "SNAP " + String(n + 1).padStart(2, "0") + " \u00B7 " + snaps[n];
    });
  }

  /* ---------- playbook: open a play, routes draw ---------- */
  var plays = document.querySelectorAll(".play");
  plays.forEach(function (play) {
    var top = play.querySelector(".play-top");
    var body = play.querySelector(".play-body");
    top.addEventListener("click", function () {
      var open = play.classList.toggle("open");
      top.setAttribute("aria-expanded", open ? "true" : "false");
      body.hidden = !open;
    });
  });

  /* ---------- audibles: circle the symptoms ---------- */
  var auds = document.querySelectorAll(".aud");
  var audCount = document.getElementById("audCount");
  var audCta = document.getElementById("audCta");
  var msgs = [
    "You've circled 0 \u2014 clean sheet. Circle two or more and it's service-call weather.",
    "One circled \u2014 worth keeping an eye on.",
    "Two circled. That's service-call weather \u2014 make the call.",
    "Three circled. That's service-call weather \u2014 make the call."
  ];
  function audMsg(k) { return msgs[Math.min(k, 3)]; }
  auds.forEach(function (b) {
    b.addEventListener("click", function () {
      b.classList.toggle("hit");
      var k = document.querySelectorAll(".aud.hit").length;
      var hot = k >= 2;
      audCount.textContent = audMsg(k);
      audCount.classList.toggle("hot", hot);
      audCta.textContent = hot ? "Call (408) 614-8840 now" : "Call (408) 614-8840";
    });
  });

  /* ---------- two-minute drill: tap a down ---------- */
  var downs = document.querySelectorAll(".down");
  var panels = document.querySelectorAll("#drill-panel p[data-step]");
  downs.forEach(function (d) {
    d.addEventListener("click", function () {
      downs.forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-selected", "false"); });
      d.classList.add("on");
      d.setAttribute("aria-selected", "true");
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-step") !== d.id; });
    });
  });

  /* ---------- yard rail: scroll progress ---------- */
  var ball = document.querySelector(".rail-ball");
  if (ball) {
    var move = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ball.style.top = (p * 100) + "%";
    };
    window.addEventListener("scroll", move, { passive: true });
    window.addEventListener("resize", move);
    move();
  }

  /* ---------- quote form ---------- */
  var form = document.getElementById("reqForm");
  var done = document.getElementById("reqDone");
  if (form && done) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
  }
  /* ---------- phone menu ---------- */
  var burger = document.getElementById("pkBurger");
  var menu = document.getElementById("pkMenu");
  if (burger && menu) {
    var closeMenu = function () {
      menu.hidden = true; burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu"); document.body.classList.remove("menu-open");
    };
    burger.addEventListener("click", function () {
      var open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { closeMenu(); burger.focus(); } });
  }

  /* ---------- staggered scroll reveals ---------- */
  var rvEls = document.querySelectorAll(".play, .aud-page, .aud-photo, .cell, .film-dusk, .down, .drill-stage, .goal-in, .goal-photo, .req-clip, .foot-brand, .foot-nav, .foot-contact");
  rvEls.forEach(function (el, i) { el.classList.add("rv"); el.style.setProperty("--d", ((i % 4) * 90) + "ms"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
