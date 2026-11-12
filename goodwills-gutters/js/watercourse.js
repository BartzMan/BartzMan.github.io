
const stops = [...document.querySelectorAll("[data-stop]")];
const panels = [...document.querySelectorAll(".route-photo")];
const points = [...document.querySelectorAll("[data-point]")];

function showStop(key) {
  stops.forEach((stop) => stop.setAttribute("aria-pressed", String(stop.dataset.stop === key)));
  panels.forEach((panel) => { panel.hidden = panel.id !== key; });
  points.forEach((point) => point.classList.toggle("is-water-point", point.dataset.point === key));
}
stops.forEach((stop) => stop.addEventListener("click", () => showStop(stop.dataset.stop)));
showStop("gutter");

const size = document.querySelector("#bench-width");
const shape = document.querySelector("#bench-shape");
const section = document.querySelector("#bench-section");
const note = document.querySelector("#bench-note");
const profiles = {
  k: { label: "K-style", path: "M95 68v105h163q33 0 43-37l17-24 12-44", detail: "The front has an angular profile." },
  round: { label: "half-round", path: "M95 68c8 146 229 146 235 0", detail: "The trough curves in a semicircle." }
};

function compareProfiles() {
  const profile = profiles[shape.value];
  const label = document.createElement("strong");
  label.textContent = size.value + "-inch " + profile.label + ".";
  section.setAttribute("d", profile.path);
  section.setAttribute("transform", size.value === "6" ? "translate(-20 0) scale(1.1 1)" : "");
  const fit = size.value === "6" ? " A wider profile can carry more water when the rest of the system is sized to match." : " A suitable size depends on how much roof feeds that run.";
  note.replaceChildren(label, " " + profile.detail + fit);
}
size.addEventListener("change", compareProfiles);
shape.addEventListener("change", compareProfiles);

