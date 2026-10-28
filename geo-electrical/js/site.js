/* geo-electrical — site behaviors
   1. Scroll reveals (.geo-rv -> .in)
   2. Traverse contour lines redraw, scroll-linked
   3. Station system: pins + chips -> crosshair snap + readout swap
   4. Crosshair drag across the sheet (snap to nearest station)
   5. Request form: success pattern
*/
(function () {
  "use strict";
  var d = document;
  var qs = function (s, r) { return (r || d).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. scroll reveals ---------- */
  var rvs = qsa(".geo-rv");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.16 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 2. traverse contours, scroll-linked ---------- */
  var tr = qs(".geo-traverse");
  var tl = tr ? qsa(".geo-tcline", tr) : [];
  if (tr && tl.length && !reduced && "IntersectionObserver" in window) {
    var ticking = false;
    var setProgress = function (p) {
      for (var i = 0; i < tl.length; i++) {
        var base = i * 0.22;
        var q = Math.min(1, Math.max(0, (p - base) / 0.56));
        tl[i].style.strokeDashoffset = String(0.55 * (1 - q));
      }
    };
    var update = function () {
      ticking = false;
      var r = tr.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var p = (vh - r.top) / (vh + r.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tl.forEach(function (l) { l.style.transition = "none"; });
          window.addEventListener("scroll", onScroll, { passive: true });
          update();
          tio.disconnect();
        }
      });
    }, { threshold: 0.12 });
    tio.observe(tr);
  } else if (tr) {
    tr.classList.add("in");
    tl.forEach(function (l) { l.style.strokeDashoffset = "0"; });
  }

  /* ---------- 3. stations ---------- */
  var STATIONS = {
    a: {
      kick: "STATION A · PINNED", title: "Panel & breaker work",
      cap: "STATION A · FIELD PLATE",
      src: "images/plate-panel-meter.jpg",
      srcset: "images/plate-panel-meter-720.jpg 720w, images/plate-panel-meter.jpg 810w",
      w: 810, h: 1080,
      alt: "Open exterior service panel with meter side and breakers wired in red and black",
      copy: "Every circuit in the house reports to one board. We size panels for the load you actually carry, swap tired breakers, label everything so the next person can read it, and bring meter-side work up to what the utility expects.",
      list: [
        "Service panels & upgrades — sized for the real load, labeled clean",
        "Breaker swaps & additions — quiet, correct, documented",
        "Sub-panels & meter work — power where the house grew"
      ]
    },
    b: {
      kick: "STATION B · PINNED", title: "Wiring & rewiring",
      cap: "STATION B · FIELD PLATE",
      src: "images/plate-rough-in.jpg",
      srcset: "images/plate-rough-in-720.jpg 720w, images/plate-rough-in.jpg 608w",
      w: 608, h: 1080,
      alt: "New electrical wiring roughed in across open ceiling joists",
      copy: "Old runs, new rooms, and the mystery junction hiding over the garage. We rewire without tearing the house apart, retire worn-out runs on a plan you approve first, and land every new circuit on a panel with room to carry it.",
      list: [
        "Whole-room rewiring — plaster, slab and attic runs handled",
        "Aging & damaged runs — replaced on a plan you approve",
        "New circuits for additions — roughed in before walls close"
      ]
    },
    c: {
      kick: "STATION C · PINNED", title: "Lighting & fixtures",
      cap: "STATION C · FIELD PLATE",
      src: "images/plate-chandelier.jpg",
      srcset: "images/plate-chandelier-720.jpg 720w, images/plate-chandelier.jpg 810w",
      w: 810, h: 1080,
      alt: "Modern chandelier hung level in front of tall windows",
      copy: "Fixtures hung straight, switched where your hand expects them, dimmed to the room. We rough in and trim out chandeliers, pendants, recessed runs and fans — and we mount anything heavy to structure, not to hope.",
      list: [
        "Chandeliers, pendants & fans — hung level, wired clean",
        "Recessed & trim lighting — laid out, installed, dimmed",
        "Heavy fixtures — blocked and anchored to structure"
      ]
    },
    d: {
      kick: "STATION D · PINNED", title: "Outlets & switches",
      cap: "STATION D · FIELD PLATE",
      src: "images/plate-outlet-ext.jpg",
      srcset: "images/plate-outlet-ext-720.jpg 720w, images/plate-outlet-ext.jpg 810w",
      w: 810, h: 1080,
      alt: "Exterior outlet and cover installed on a house wall",
      copy: "Outlets and switches are the part of the system you touch every day. We add them where life actually happens, swap worn or back-stabbed devices, and put weather and ground-fault protection where the water is.",
      list: [
        "New outlets & switches — kitchens, baths, garages, patios",
        "Outdoor & wet-location protection — covered and grounded",
        "USB & smart devices — swapped in, set up, explained"
      ]
    },
    e: {
      kick: "STATION E · PINNED", title: "EV & new circuits",
      cap: "STATION E · FIELD PLATE",
      src: "images/plate-ev-wall.jpg",
      srcset: "images/plate-ev-wall-720.jpg 720w, images/plate-ev-wall.jpg 1080w",
      w: 1080, h: 810,
      alt: "EV charger mounted on a garage wall beside a coiled cable",
      copy: "A charger on the wall is a circuit first and a gadget second. We run dedicated EV lines from the panel out to where the car sleeps, size them to the car and the service, and leave room in the board for what comes next.",
      list: [
        "Level 2 EV charging — a dedicated line, sized to the car",
        "Ranges, dryers & shop tools — the big loads, run right",
        "Additions & remodels — circuits planned before walls close"
      ]
    }
  };

  var readout = qs("#geo-readout");
  var roImg = qs("#geo-ro-img");
  var roCap = qs("#geo-ro-platecap");
  var roKick = qs("#geo-ro-kick");
  var roTitle = qs("#geo-ro-title");
  var roCopy = qs("#geo-ro-copy");
  var roList = qs("#geo-ro-list");
  var pins = qsa(".geo-pin");
  var chips = qsa(".geo-chip");
  var xh = qs("#geo-xh");
  var current = "a";
  var swapTimer = null;

  function moveCrosshair(key) {
    var pin = qs("#geo-pin-" + key);
    if (!pin || !xh) return;
    xh.style.left = pin.style.getPropertyValue("--x");
    xh.style.top = pin.style.getPropertyValue("--y");
  }

  function renderStation(s) {
    var st = STATIONS[s];
    if (!st || !readout) return;
    roImg.src = st.src;
    roImg.srcset = st.srcset;
    roImg.width = st.w;
    roImg.height = st.h;
    roImg.alt = st.alt;
    roCap.textContent = st.cap;
    roKick.textContent = st.kick;
    roTitle.textContent = st.title;
    roCopy.textContent = st.copy;
    roList.textContent = "";
    st.list.forEach(function (item) {
      var li = d.createElement("li");
      li.textContent = item;
      roList.appendChild(li);
    });
  }

  function selectStation(key, moveOnly) {
    if (!STATIONS[key]) return;
    current = key;
    pins.forEach(function (p) { p.setAttribute("aria-pressed", String(p.getAttribute("data-station") === key)); });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-station") === key)); });
    moveCrosshair(key);
    if (moveOnly || !readout) return;
    if (reduced) { renderStation(key); return; }
    readout.classList.add("swap");
    if (swapTimer) window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(function () {
      renderStation(key);
      readout.classList.remove("swap");
    }, 180);
  }

  pins.concat(chips).forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectStation(btn.getAttribute("data-station"));
    });
  });

  /* crosshair starts pinned to the server-rendered station */
  moveCrosshair(current);

  /* ---------- 4. crosshair drag ---------- */
  var frame = qs(".geo-mapframe");
  if (frame && xh) {
    var dragging = false;
    var pct = function (clientX, clientY) {
      var r = frame.getBoundingClientRect();
      var x = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      var y = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
      return { x: x, y: y };
    };
    var setXH = function (p) {
      xh.style.left = p.x + "%";
      xh.style.top = p.y + "%";
    };
    var nearest = function (p) {
      var bestKey = null, bestD = Infinity;
      pins.forEach(function (pin) {
        var px = parseFloat(pin.style.getPropertyValue("--x"));
        var py = parseFloat(pin.style.getPropertyValue("--y"));
        var dist = Math.hypot(p.x - px, p.y - py);
        if (dist < bestD) { bestD = dist; bestKey = pin.getAttribute("data-station"); }
      });
      return bestD <= 15 ? bestKey : null;
    };
    frame.addEventListener("pointerdown", function (ev) {
      if (ev.target.closest(".geo-pin")) return;
      dragging = true;
      frame.classList.add("geo-dragging");
      try { frame.setPointerCapture(ev.pointerId); } catch (err) { /* ok */ }
      setXH(pct(ev.clientX, ev.clientY));
      ev.preventDefault();
    });
    frame.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      setXH(pct(ev.clientX, ev.clientY));
    });
    var endDrag = function (ev) {
      if (!dragging) return;
      dragging = false;
      frame.classList.remove("geo-dragging");
      var p = pct(ev.clientX, ev.clientY);
      var key = nearest(p);
      if (key) { selectStation(key); } else { moveCrosshair(current); }
    };
    frame.addEventListener("pointerup", endDrag);
    frame.addEventListener("pointercancel", endDrag);
  }

  /* ---------- 5. form ---------- */
  var form = qs("#geo-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var ok = qs("#geo-form-ok");
      var prev = qs("#geo-form-preview");
      var btn = qs("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
      if (prev) prev.hidden = false;
      if (ok) {
        ok.hidden = false;
        ok.setAttribute("tabindex", "-1");
        ok.focus();
      }
    });
  }
})();
