/* ==========================================================================
   BZ DUCT SHOP — vanilla behaviour
   js/ductshop.js
   1. marks the document as scripted (so CSS can safely hide reveal targets)
   2. scroll reveal, opt-in, never hides anything permanently
   3. marks the nav item for the section you are reading
   4. builds a mailto: draft from the job ticket form — no backend, no upload
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  root.classList.add("sm-js");

  /* --- 1. scroll reveal -------------------------------------------------- */
  var revealables = document.querySelectorAll(".reveal");
  var i;
  if (!revealables.length) {
    /* nothing to do */
  } else if (!("IntersectionObserver" in window) || reduce) {
    for (i = 0; i < revealables.length; i++) revealables[i].classList.add("is-in");
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) {
            entries[k].target.classList.add("is-in");
            io.unobserve(entries[k].target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    for (i = 0; i < revealables.length; i++) io.observe(revealables[i]);
  }

  /* --- 2. nav: mark the section in view ---------------------------------- */
  var navLinks = document.querySelectorAll('.sm-nav a[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    var sections = [];
    for (i = 0; i < navLinks.length; i++) {
      var id = navLinks[i].getAttribute("href").slice(1);
      var sec = id ? document.getElementById(id) : null;
      if (sec) {
        map[sec.id] = navLinks[i];
        sections.push(sec);
      }
    }
    if (sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          for (var k = 0; k < entries.length; k++) {
            if (!entries[k].isIntersecting) continue;
            var el = map[entries[k].target.id];
            if (!el) continue;
            for (var j = 0; j < navLinks.length; j++) navLinks[j].removeAttribute("aria-current");
            el.setAttribute("aria-current", "location");
          }
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      for (i = 0; i < sections.length; i++) spy.observe(sections[i]);
    }
  }

  /* --- 3. job ticket -> mailto draft ------------------------------------- */
  var form = document.getElementById("sm-enquiry");
  if (form) {
    var TO = "bzductshop@gmail.com";

    var readField = function (name) {
      var el = form.querySelector('[name="' + name + '"]');
      var out = el ? el.value.replace(/\s+/g, " ").trim() : "";
      return out === "" ? "—" : out;
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var body = [
        "Name: " + readField("name"),
        "Phone or email: " + readField("contact"),
        "Building or area: " + readField("place"),
        "",
        "Job:",
        readField("job")
      ].join("\n");
      window.location.href =
        "mailto:" +
        TO +
        "?subject=" +
        encodeURIComponent("Ductwork enquiry") +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();