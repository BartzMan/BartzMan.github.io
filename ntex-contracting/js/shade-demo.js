
const buttons = [...document.querySelectorAll("[data-ntex-service]")];
const services = [...document.querySelectorAll(".highvis-service-view")];
function showExterior(id) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.ntexService === id)));
  services.forEach((service) => { service.hidden = service.id !== "view-" + id; });
}
buttons.forEach((button) => button.addEventListener("click", () => showExterior(button.dataset.ntexService)));
showExterior("roof");

const slider = document.querySelector("#sun-slider");
const glare = document.querySelector("#glare-beam");
const mesh = document.querySelector("#shade-mesh");
const outcome = document.querySelector("#daylight-result");
const notes = [
  ["Open view.", "Direct sun makes a brighter patch inside the room."],
  ["Partly screened.", "The mesh softens the bright patch and leaves part of the view open."],
  ["Screen down.", "Exterior mesh can soften glare and reduce the solar heat reaching the room."]
];
slider.addEventListener("input", () => {
  const covered = Number(slider.value) / 100;
  glare.style.opacity = String(.75 - .62 * covered);
  mesh.style.opacity = String(covered);
  const [title, message] = notes[covered > .8 ? 2 : covered > .15 ? 1 : 0];
  if (slider.getAttribute("aria-valuetext") === title) return;
  slider.setAttribute("aria-valuetext", title);
  const heading = document.createElement("strong");
  heading.textContent = title;
  outcome.replaceChildren(heading, " " + message);
});

