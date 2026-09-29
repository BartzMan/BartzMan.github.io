const drawer = document.getElementById("drawer");
document.querySelectorAll("[data-menu]").forEach((btn) => {
  btn.addEventListener("click", () => drawer && drawer.classList.toggle("open"));
});
document.querySelectorAll("#drawer a").forEach((a) => {
  a.addEventListener("click", () => drawer && drawer.classList.remove("open"));
});

const form = document.getElementById("quote");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const err = form.querySelector(".err");
    if (!data.name || !data.phone) {
      if (err) err.textContent = "Name and phone are enough to start.";
      return;
    }
    const jobs = JSON.parse(localStorage.getItem("mejias-quotes") || "[]");
    jobs.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("mejias-quotes", JSON.stringify(jobs));
    form.reset();
    const city = form.querySelector('[name="city"]');
    if (city) city.value = "Mesa";
    if (err) err.textContent = "";
    let ok = form.querySelector(".okmsg");
    if (!ok) {
      ok = document.createElement("p");
      ok.className = "okmsg";
      form.appendChild(ok);
    }
    ok.textContent = "Saved. Call (480) 969-6719 if the tree is on the house — do not wait on the form.";
  });
}
