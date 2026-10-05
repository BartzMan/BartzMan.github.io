/* =============================================================================
   NRV HVAC LLC  ·  "SPEC SHEET"
   js/sheet.js  ·  vanilla, no dependencies, degrades safely
   -----------------------------------------------------------------------------
   1  scroll reveal (opt-in class is added by JS, so content is never hidden
      when JS is unavailable or motion is reduced)
   2  the hero's overall dimension line is labelled with the real measured
      width of the drawing field; without JS it keeps its static label
   3  request form -> opens the visitor's own text message app
   ============================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : true;

  /* ------------------------------------------------------------ 1. reveal */
  function reveal() {
    var targets = document.querySelectorAll("[data-reveal]");

    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < targets.length; i++) { targets[i].classList.add("is-in"); }
      return;
    }

    root.classList.add("js-reveal");

    var io = new IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (entries[j].isIntersecting) {
            entries[j].target.classList.add("is-in");
            io.unobserve(entries[j].target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    for (var k = 0; k < targets.length; k++) { io.observe(targets[k]); }

    window.addEventListener("beforeprint", function () {
      for (var m = 0; m < targets.length; m++) { targets[m].classList.add("is-in"); }
      root.classList.remove("js-reveal");
    });
  }

  /* ------------------------------------------- 2. overall dimension readout */
  function measureField() {
    var lines = document.querySelectorAll("[data-measure]");
    if (!lines.length) { return; }

    function paint() {
      for (var i = 0; i < lines.length; i++) {
        var host = lines[i].closest("[data-measure-of]");
        if (!host) { continue; }
        var w = Math.round(host.getBoundingClientRect().width);
        if (w > 0) { lines[i].setAttribute("data-dim", "drawing field · " + w + " px"); }
      }
    }

    paint();
    window.addEventListener("resize", paint);
    window.addEventListener("orientationchange", paint);
    window.addEventListener("beforeprint", paint);
  }

  /* --------------------------------------------- 3. request -> text message */
  function val(id) {
    var el = document.getElementById(id);
    if (!el) { return ""; }
    return el.value.replace(/\s+/g, " ").trim();
  }

  function message() {
    var name = val("rq-name");
    var phone = val("rq-phone");
    var job = val("rq-job");
    var lines = ["Heating and cooling request via nrv-hvac demo site"];
    if (name) { lines.push("Name: " + name); }
    if (phone) { lines.push("Phone: " + phone); }
    if (job) { lines.push("Job: " + job); }
    lines.push("Address in Jamaica, Queens: ");
    return lines.join("\n");
  }

  function wireForm() {
    var form = document.getElementById("request-form");
    if (!form) { return; }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (typeof form.reportValidity === "function" && !form.reportValidity()) { return; }
      window.location.href = "sms:+16468970467?body=" + encodeURIComponent(message());
    });
  }

  /* -------------------------------------------------------------- 4. init */
  function init() {
    reveal();
    measureField();
    wireForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();