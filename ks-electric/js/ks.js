(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- header, amp meter ---------- */
  var head = $(".ks-head"), ampFill = $("#ampFill"), ampRead = $("#ampRead");
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    head.classList.toggle("scrolled", y > 30);
    ampFill.style.transform = "scaleX(" + p.toFixed(4) + ")";
    var a = Math.round(p * 200);
    ampRead.textContent = ("00" + a).slice(-3) + "A";
    drawBolt();
  }

  /* ---------- phone sheet ---------- */
  var burger = $("#burger"), sheet = $("#sheet");
  function setSheet(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setSheet(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setSheet(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setSheet(false); burger.focus(); } });

  /* ---------- STANDBY: the storm switch ---------- */
  var sw = $("#stormSwitch"), gaugeTxt = $("#gaugeTxt"), note = $("#switchNote");
  var hsTitle = $("#heroStatusTitle"), hsSub = $("#heroStatusSub");
  var busy = false;
  function pad(n) { return ("0000" + n).slice(-4); }
  function runRpm(ms) {
    var t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / ms);
      hsSub.textContent = "Engine " + pad(Math.round(1800 * (1 - Math.pow(1 - k, 2)))) + " RPM";
      if (k < 1 && root.classList.contains("ks-boot")) requestAnimationFrame(tick);
    })(t0);
  }
  function flip() {
    if (busy) return;
    busy = true;
    root.classList.add("ks-used");
    sw.setAttribute("aria-pressed", "true");
    root.classList.remove("ks-flash"); void root.offsetWidth;
    root.classList.add("ks-out");
    if (!reduce) root.classList.add("ks-flash");
    gaugeTxt.textContent = "Utility power out";
    hsTitle.textContent = "Grid down"; hsSub.textContent = "Lake Erie storm";
    note.textContent = "Power is out across the block. Standing by.";
    setTimeout(function () {
      root.classList.remove("ks-out", "ks-flash");
      if (reduce) { done(); return; }
      root.classList.add("ks-boot");
      gaugeTxt.textContent = "Generator starting";
      hsTitle.textContent = "Standby starting";
      runRpm(2200);
      setTimeout(done, 3900);
    }, reduce ? 900 : 1700);
  }
  function done() {
    root.classList.remove("ks-boot");
    sw.setAttribute("aria-pressed", "false");
    gaugeTxt.textContent = "Standby: online";
    note.textContent = "Generator online. Every circuit relit, one by one. Flip it again any time.";
    busy = false;
  }
  sw.addEventListener("click", flip);
  $("#flipAgain").addEventListener("click", function () {
    document.getElementById("hero").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(flip, reduce ? 0 : 700);
  });

  /* ---------- SERVICES: circuits as tabs, photo relights ---------- */
  var tabs = $$("#svcTabs .ks-tab"), views = $$("#viewer .ks-view"), desc = $("#svcDesc");
  function pick(i, focus) {
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    views.forEach(function (v, j) {
      v.hidden = j !== i;
      v.classList.toggle("on", j === i);
      v.classList.remove("flick");
      if (j === i && !reduce) { void v.offsetWidth; v.classList.add("flick"); }
    });
    desc.textContent = $(".ks-tab-body", tabs[i]).textContent;
    if (focus) tabs[i].focus();
    var strip = $("#svcTabs");
    if (window.innerWidth <= 760) strip.scrollTo({ left: tabs[i].offsetLeft - 18, behavior: "smooth" });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { pick(i); });
    t.addEventListener("keydown", function (e) {
      var k = e.key, n = tabs.length;
      if (k === "ArrowDown" || k === "ArrowRight") { e.preventDefault(); pick((i + 1) % n, true); }
      if (k === "ArrowUp" || k === "ArrowLeft") { e.preventDefault(); pick((i + n - 1) % n, true); }
    });
  });
  pick(0);

  /* ---------- USEFUL: power out wizard ---------- */
  var wizBody = $("#wizBody"), track = $$("#wiz .ks-wiz-track li");
  var arrow = '<svg class="ks-ic" aria-hidden="true"><use href="#i-arrow"/></svg>';
  var S = {
    s1: { step: 1, q: "Is the whole street dark?", p: "Look outside. Are the neighbours' windows and the street lights out too?",
      opts: [["Yes, the whole street", "grid"], ["No, just my house", "s2"]] },
    s2: { step: 2, q: "Open the breaker panel.", p: "Is any switch sitting halfway or in the off position?",
      opts: [["Yes, one is tripped", "trip"], ["No, they all look normal", "main"]], mini: true },
    grid: { step: 3, flag: "Likely a grid outage", q: "Wait it out, safely.", p: "Report it to your utility, keep the fridge shut, and use flashlights. If you see a downed power line, stay well back and call 911.", end: true },
    trip: { step: 3, flag: "Try one reset", q: "Off, then on, once.", p: "Push that breaker fully off, then back on. If it trips again, leave it off and call an electrician. Never keep forcing it.", end: true },
    main: { step: 3, flag: "Check the main", q: "Look at the main breaker.", p: "If the main is off, reset it once. Still dark? It may be the service or the meter. Call an electrician. Burning smell or sparks: leave and call 911.", end: true }
  };
  function miniState(on) {
    $$("#miniBreakers .mb").forEach(function (b, i) { b.classList.toggle("trip", on && i === 3); });
  }
  function render(id) {
    var s = S[id];
    track.forEach(function (li, i) {
      li.classList.toggle("on", i + 1 === s.step);
      li.classList.toggle("done", i + 1 < s.step);
    });
    var h = "";
    if (s.flag) h += '<span class="ks-wiz-flag">' + s.flag + "</span>";
    h += '<h3 class="ks-wiz-q">' + s.q + "</h3><p class=\"ks-wiz-p\">" + s.p + "</p>";
    if (s.opts) {
      h += '<div class="ks-wiz-opts">';
      s.opts.forEach(function (o) { h += '<button type="button" class="ks-wiz-opt" data-go="' + o[1] + '"><span>' + o[0] + "</span>" + arrow + "</button>"; });
      h += "</div>";
    } else {
      h += '<div class="ks-wiz-opts"><div class="ks-wiz-end"><a class="ks-pill ks-pill-call ks-pill-lg" href="tel:+12162358538"><svg class="ks-ic" aria-hidden="true"><use href="#i-phone"/></svg><span>Call (216) 235-8538</span></a><button type="button" class="ks-wiz-opt alt" data-go="s1"><span>Start over</span></button></div></div>';
    }
    wizBody.innerHTML = h;
    wizBody.style.animation = "none"; void wizBody.offsetWidth; wizBody.style.animation = "";
    miniState(id === "s2" || id === "trip");
  }
  wizBody.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (b) render(b.getAttribute("data-go"));
  });
  var mb = $("#miniBreakers"), mh = "";
  for (var r = 0; r < 6; r++) for (var c = 0; c < 2; c++) {
    mh += '<g class="mb" transform="translate(' + (24 + c * 58) + ' ' + (62 + r * 24) + ')"><rect width="50" height="18" rx="3" fill="#1b2538" stroke="#52607a"/><rect class="mb-lever" x="' + (c ? 6 : 28) + '" y="3" width="16" height="12" rx="2" fill="#e9edf2"/></g>';
  }
  mb.innerHTML = mh;
  var st = document.createElement("style");
  st.textContent = ".mb.trip .mb-lever{fill:#ff6a1f;transform:translateY(0);}.mb.trip rect:first-child{stroke:#ff6a1f;stroke-width:2}";
  document.head.appendChild(st);
  render("s1");

  /* ---------- TORCH ---------- */
  var tz = $("#torchZone"), tbtn = $("#torchBtn");
  function aim(x, y) {
    var r = tz.getBoundingClientRect();
    tz.style.setProperty("--tx", (x - r.left) + "px");
    tz.style.setProperty("--ty", (y - r.top) + "px");
  }
  tbtn.addEventListener("click", function () {
    var on = tz.classList.toggle("torch-on");
    tbtn.setAttribute("aria-pressed", on ? "true" : "false");
    tbtn.querySelector("span").textContent = on ? "Lights on" : "Torch mode";
  });
  tz.addEventListener("pointermove", function (e) { if (tz.classList.contains("torch-on")) aim(e.clientX, e.clientY); });
  tz.addEventListener("pointerdown", function (e) { if (tz.classList.contains("torch-on")) aim(e.clientX, e.clientY); });
  tz.addEventListener("touchmove", function (e) { if (tz.classList.contains("torch-on") && e.touches[0]) aim(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

  /* ---------- Cleveland bolt draw ---------- */
  var cle = $("#cleveland"), bolt = $("#boltDraw");
  function drawBolt() {
    var r = cle.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh - r.top) / (vh * 0.9);
    p = Math.min(1, Math.max(0, p));
    bolt.style.strokeDashoffset = reduce ? 0 : (1 - p).toFixed(3);
  }

  /* ---------- reveal on scroll ---------- */
  var sel = [".ks-circuits-list h2", ".ks-tab", ".ks-viewer", ".ks-check-head > *", ".ks-wiz", ".ks-cle-row", ".ks-lights-head > *", ".ks-fix-photo", ".ks-fix-lede", ".ks-fix-list li", ".ks-contact-top > *", ".ks-contact-card", ".ks-form", ".ks-foot-grid > *"];
  var items = [];
  sel.forEach(function (s) { $$(s).forEach(function (el, i) { el.classList.add("rv"); el.style.setProperty("--d", i % 5); items.push(el); }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add("in"); });

  /* ---------- form ---------- */
  $("#quoteForm").addEventListener("submit", function (e) { e.preventDefault(); });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
