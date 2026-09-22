
const ham = document.querySelector(".ham");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".close");
function openMenu(){ overlay.hidden = false; document.body.classList.add("menu-open"); }
function closeMenu(){ overlay.hidden = true; document.body.classList.remove("menu-open"); }
ham?.addEventListener("click", openMenu);
close?.addEventListener("click", closeMenu);
document.querySelectorAll("[data-quote]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name")||"").trim();
    const phone = String(fd.get("phone")||"").trim();
    const city = String(fd.get("city")||"").trim();
    const service = String(fd.get("service")||"").trim();
    const message = String(fd.get("message")||"").trim();
    const err = form.querySelector(".err");
    if (name.length < 2) { err.hidden = false; err.textContent = "Please enter your name."; return; }
    if (phone.replace(/\D/g,"").length < 10) { err.hidden = false; err.textContent = "Please enter a 10-digit phone number."; return; }
    if (!city) { err.hidden = false; err.textContent = "Which city is the yard in?"; return; }
    const body = `Hi City2City, I'm ${name} in ${city}. ${service ? "Need: "+service+". " : ""}${message} Call me at ${phone}.`;
    form.hidden = true;
    const ok = form.parentElement.querySelector(".quote-ok");
    ok.hidden = false;
    ok.querySelector(".sms").href = "sms:+14805098107?&body=" + encodeURIComponent(body);
  });
});
