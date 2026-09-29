(function () {
  var nav = document.querySelector(".nav");
  var drawer = document.getElementById("drawer");
  var openers = document.querySelectorAll("[data-menu]");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("solid", window.scrollY > 16);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  openers.forEach(function (b) {
    b.addEventListener("click", function () {
      if (!drawer) return;
      drawer.classList.toggle("open");
      document.body.style.overflow = drawer.classList.contains("open") ? "hidden" : "";
    });
  });
  var form = document.getElementById("quote");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var name = String(fd.get("name") || "").trim();
    var phone = String(fd.get("phone") || "").replace(/\D/g, "");
    var city = String(fd.get("city") || "").trim();
    var err = form.querySelector(".err");
    if (name.length < 2) { err.textContent = "Your name."; return; }
    if (phone.length < 10) { err.textContent = "A phone number we can call."; return; }
    if (!city) { err.textContent = "Which city is the tree in?"; return; }
    form.innerHTML =
      '<div class="ok"><h3>Call the crew.</h3><p class="tiny" style="margin-top:0.8rem;font-size:0.95rem;color:#5e574f;line-height:1.5">The fastest way through is the phone. Tell them what the tree is doing.</p><a class="btn" style="margin-top:1rem" href="tel:+14809696719">Call (480) 969-6719</a></div>';
  });
})();
