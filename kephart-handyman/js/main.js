/* Kephart Handyman — interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* tape-measure scroll progress */
  var tape = $("#kpTape"), tip = $("#kpTapeTip");
  var tapeTotal = 192;
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var f = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
    if (tape) {
      tape.style.width = (f * 100).toFixed(2) + "%";
    }
    var inches = Math.round(f * tapeTotal);
    if (tip) tip.textContent = inches + "\u2033";
    var head = $("#kpHead");
    if (head) head.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* full-screen menu sheet */
  var burger = $("#kpBurger"), sheet = $("#kpSheet");
  function closeSheet() {
    if (!sheet || !burger) return;
    sheet.classList.remove("is-open");
    sheet.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger && sheet) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      if (open) { closeSheet(); return; }
      sheet.hidden = false;
      requestAnimationFrame(function () { sheet.classList.add("is-open"); });
      burger.setAttribute("aria-expanded", "true");
      var first = $(".kp-sheet-links a", sheet);
      if (first) first.focus();
    });
    $$(".kp-sheet-links a", sheet).forEach(function (a) {
      a.addEventListener("click", closeSheet);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSheet();
    });
  }

  /* the list: tick jobs off the sheet */
  var rows = $$(".kp-row"), tally = $("#kpTally"), wipe = $("#kpWipe");
  function countTicks() {
    var n = 0;
    rows.forEach(function (r) { if (r.getAttribute("aria-pressed") === "true") n++; });
    if (tally) {
      tally.textContent = n === 0
        ? "nothing ticked yet \u2014 tap a line"
        : n + " of " + rows.length + " ticked off";
    }
  }
  rows.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", open ? "false" : "true");
      countTicks();
    });
  });
  if (wipe) {
    wipe.addEventListener("click", function () {
      rows.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      countTicks();
    });
  }
  countTicks();

  /* before-you-call pad */
  var CHECKS = [
    ["Slow-draining sink",
     "Look in the basket strainer first \u2014 hair and crumbs sit right there. Lift what you can by hand. If the water still lags, the trap or the line is the trouble, and a pro can clear it from the clean-out."],
    ["Running toilet",
     "Lift the tank lid and jiggle the flapper. If the noise settles down, the chain or the seat is what wants attention. Note the sound of the refill, too \u2014 it helps on the phone."],
    ["Dripping tap",
     "Close the handle all the way before anything else. A worn washer or cartridge is the usual culprit; a note of the brand makes the swap quick."],
    ["Sticking door",
     "Run a finger over the hinge screws \u2014 a loose screw ages a door quickly. Rubbing at the top edge usually means the door has swollen with the weather."],
    ["Tripped GFCI outlet",
     "Before anything about an outlet worries you, press the reset button on the kitchen or bathroom receptacle. It trips for a reason and usually resets quietly."]
  ];
  var padNum = $("#kpPadNum"), padTitle = $("#kpPadTitle"), padBody = $("#kpPadBody"),
      pencil = $("#kpPencil"), dots = $$(".kp-dot");
  var PAD_LINE = 300;
  function showCheck(i) {
    CHECKS.forEach(function (_, k) {
      dots[k].setAttribute("aria-selected", String(k === i));
    });
    var picked = CHECKS[i];
    padTitle.textContent = picked[0];
    padBody.textContent = picked[1];
    padNum.textContent = "check " + (i + 1) + " of " + CHECKS.length;
    pencil.setAttribute("x2", (PAD_LINE * ((i + 1) / CHECKS.length)).toFixed(1));
    if (!reduceMotion) {
      padBody.style.opacity = 0;
      setTimeout(function () { padBody.style.opacity = 1; }, 120);
    }
  }
  function checkAt() {
    var i = 0;
    dots.some(function (d, k) {
      if (d.getAttribute("aria-selected") === "true") { i = k; return true; }
      return false;
    });
    return i;
  }
  if (padBody) padBody.style.transition = "opacity .22s";
  dots.forEach(function (d, k) {
    d.addEventListener("click", function () { showCheck(k); });
  });
  var padPrev = $("#kpPadPrev"), padNext = $("#kpPadNext");
  if (padPrev) padPrev.addEventListener("click", function () { showCheck((checkAt() + CHECKS.length - 1) % CHECKS.length); });
  if (padNext) padNext.addEventListener("click", function () { showCheck((checkAt() + 1) % CHECKS.length); });

  /* visit steps */
  var VISIT = [
    ["It starts as a phone line",
     "Call, text or use the form below. Whatever the job is \u2014 a faucet, a tank, a floor \u2014 it goes on the same clipboard, so nothing lives in memory."],
    ["Walk the room together",
     "On arrival the first minutes are spent looking at the job, not guessing: the leak, the board, the vent \u2014 seen together with the people who live with it."],
    ["The work",
     "Repairs, swaps and installs go room by room, one line of the list at a time \u2014 tools in, tools out, the drop cloth up before anything else."],
    ["Tidy-up",
     "The room gets put back before the truck pulls away: mess out, fittings squared, and the finished line of the list gets its tick."]
  ];
  var VTABS = $$(".kp-vtab"), vTitle = $("#kpVTitle"), vBody = $("#kpVBody"), vStep = $("#kpVStep");
  function showVisit(i) {
    VTABS.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); });
    vTitle.textContent = VISIT[i][0];
    vBody.textContent = VISIT[i][1];
    vStep.textContent = "step " + (i + 1) + " of 4";
  }
  function visitAt() {
    var i = 0;
    VTABS.some(function (b, k) {
      if (b.getAttribute("aria-pressed") === "true") { i = k; return true; }
      return false;
    });
    return i;
  }
  VTABS.forEach(function (b, k) { b.addEventListener("click", function () { showVisit(k); }); });
  var vPrev = $("#kpVPrev"), vNext = $("#kpVNext");
  if (vPrev) vPrev.addEventListener("click", function () { showVisit((visitAt() + 3) % 4); });
  if (vNext) vNext.addEventListener("click", function () { showVisit((visitAt() + 1) % 4); });

  /* form */
  var form = $("#qform"), note = $("#kpNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim(),
          phone = form.phone.value.trim(),
          email = form.email.value.trim();
      if (!name || !phone || email.indexOf("@") < 1) {
        note.textContent = "The list needs name, a phone number and a working email address.";
        if (!name) form.name.focus();
        else if (!phone) form.phone.focus();
        else form.email.focus();
        return;
      }
      note.textContent = "On the sheet \u2014 now call or text, while the list is in hand.";
      form.reset();
    });
  }

  /* reveal on scroll */
  var reveals = $$(".kp-sec-head, .kp-board, .kp-pad, .kp-pad-side, .kp-sheet-visits, .kp-contact-card, .kp-form-wrap, .kp-banner-big");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    reveals.forEach(function (el) { el.classList.add("rv"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: .12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* anchor offset for the fixed header */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop) - 76;
      if (top < 0) top = 0;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
