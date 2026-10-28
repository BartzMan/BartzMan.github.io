/* DC Pro Painting - red rock interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 1. roller progress bar + parallax + how-it-goes-on line (one rAF loop) */
  var trail = $(".trail");
  var banner = $(".banner");
  var bannerImg = $(".banner__img");
  var howTrack = $("#howTrack");
  var steps = $$(".how__steps li");
  var ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    trail.style.setProperty("--p", p.toFixed(4));
    if (bannerImg && banner && !reduce) {
      var r = banner.getBoundingClientRect();
      var mid = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
      bannerImg.style.setProperty("--py", (mid * -48).toFixed(1) + "px");
    }
    if (howTrack) {
      var b = howTrack.getBoundingClientRect();
      var start = window.innerHeight * 0.82, end = window.innerHeight * 0.28;
      var q = (start - b.top) / (start - end + b.height * 0.55);
      q = Math.min(1, Math.max(0, q));
      howTrack.style.setProperty("--p", q.toFixed(3));
      steps.forEach(function (li) { li.classList.toggle("lit", q >= parseFloat(li.dataset.at)); });
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* 2. staggered reveal */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* 3. mobile menu */
  var burger = $(".burger"), sheet = $("#sheet");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(sheet.hidden); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 900 && !sheet.hidden) setMenu(false); });

  /* 4. pick a coat: repaint the drawn house */
  var house = $("#house"), log = $("#paintLog"), fan = $("#fan");
  var surface = "wall";
  var state = { wall: ["Mojave Sand", "#e3cba1"], trim: ["Dune Cream", "#f2e6cf"], door: ["Red Rock", "#9a3f2b"] };
  var varOf = { wall: "--c-wall", trim: "--c-trim", door: "--c-door" };
  function paintLog() {
    log.innerHTML = "<b>Walls</b> " + state.wall[0] + " &nbsp;&middot;&nbsp; <b>Trim</b> " + state.trim[0] + " &nbsp;&middot;&nbsp; <b>Door</b> " + state.door[0];
  }
  function markPick() {
    $$(".sw", fan).forEach(function (s) { s.classList.toggle("is-pick", s.dataset.name === state[surface][0]); });
  }
  $$(".surf").forEach(function (b) {
    b.addEventListener("click", function () {
      surface = b.dataset.surface;
      $$(".surf").forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", on ? "true" : "false"); });
      markPick();
    });
  });
  $$(".sw", fan).forEach(function (s) {
    s.addEventListener("click", function () {
      state[surface] = [s.dataset.name, s.dataset.c];
      house.style.setProperty(varOf[surface], s.dataset.c);
      paintLog(); markPick();
    });
  });
  markPick();
  if ("IntersectionObserver" in window) {
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { fan.classList.add("is-open"); fo.disconnect(); } });
    }, { threshold: 0.25 });
    fo.observe(fan);
  } else { fan.classList.add("is-open"); }

  /* 5. service strips: tap or focus to open */
  var strips = $$(".strip");
  function openStrip(s) {
    strips.forEach(function (x) { var on = x === s; x.classList.toggle("is-open", on); x.setAttribute("aria-expanded", on ? "true" : "false"); });
  }
  strips.forEach(function (s) {
    s.addEventListener("click", function (e) { if (!s.classList.contains("is-open") && !e.target.closest("a")) openStrip(s); });
    s.addEventListener("focus", function () { openStrip(s); });
    s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { if (e.target === s) { e.preventDefault(); openStrip(s); } } });
    s.addEventListener("mouseenter", function () { if (window.innerWidth > 900) openStrip(s); });
  });

  /* 6. wall wipe */
  var fig = $("#wipeFig"), range = $("#wipeRange");
  function setWipe() { fig.style.setProperty("--w", range.value + "%"); }
  range.addEventListener("input", setWipe);
  setWipe();
  var grip = $(".wipe__grip");
  range.addEventListener("pointerdown", function () { if (grip) grip.style.animation = "none"; });
  range.addEventListener("focus", function () { if (grip) grip.style.animation = "none"; });

  /* 7. gallery lightbox */
  var lb = $("#lb");
  if (lb && lb.showModal) {
    var lbImg = $("img", lb), lbCap = $(".lb__cap", lb);
    $$(".tile").forEach(function (t) {
      t.addEventListener("click", function () {
        lbImg.src = t.dataset.full; lbImg.alt = t.dataset.alt;
        lbCap.textContent = $(".tile__cap", t).textContent + ". Illustrative stock photo.";
        lb.showModal();
      });
    });
    $(".lb__x", lb).addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  } else {
    $$(".tile").forEach(function (t) { t.style.cursor = "default"; });
  }

  /* 8. quote form (preview): no backend yet */
  var form = $("#quote"), note = $("#quoteNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("input[required]", form).filter(function (i) { return !i.value.trim(); });
    if (bad.length) { bad[0].focus(); note.textContent = "Please fill in your name, phone and email so we know who to reply to."; return; }
    note.textContent = "Thanks. This website is a preview, so the request form is switched off for now. To reach the business today, call (702) 338-6613 or message on WhatsApp.";
  });

  /* 9. paint-dot cursor (mouse only) */
  var dot = $(".dot");
  if (dot && window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    var raf = 0, x = 0, y = 0;
    window.addEventListener("mousemove", function (e) {
      x = Math.min(window.innerWidth - 8, e.clientX); y = e.clientY;
      dot.classList.add("on");
      if (!raf) raf = requestAnimationFrame(function () { dot.style.transform = "translate(" + x + "px," + y + "px)"; raf = 0; });
    }, { passive: true });
    document.addEventListener("mouseleave", function () { dot.classList.remove("on"); });
    document.addEventListener("mouseover", function (e) { dot.classList.toggle("big", !!e.target.closest("a,button,.strip,input[type=range]")); });
  }
})();
