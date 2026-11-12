const serviceButtons = [...document.querySelectorAll("[data-lap-service]")];
const serviceFrames = [...document.querySelectorAll(".lap-service-frame")];

function showService(button) {
  serviceButtons.forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)));
  serviceFrames.forEach((frame) => { frame.hidden = frame.id !== button.dataset.lapService; });
}

serviceButtons.forEach((button) => button.addEventListener("click", () => showService(button)));
if (serviceButtons.length) showService(serviceButtons[0]);

const paint = {
  navy: ["Navy", "Warm white trim and graphite shutters.", "#243855", "#f2eee3", "#282c31"],
  slate: ["Slate blue", "Bright trim and deep navy shutters.", "#66809a", "#fffaf0", "#263752"],
  grey: ["Grey", "Ivory trim and near-black shutters.", "#969a97", "#f9f0dd", "#222629"],
  white: ["White", "Light grey trim and blue shutters.", "#fbfbf8", "#ced1d0", "#34465d"],
  rust: ["Autumn red", "Cream trim and warm charcoal shutters.", "#a54e32", "#f7e6c7", "#392f2e"]
};
const swatches = [...document.querySelectorAll("[data-tone]")];
const house = document.querySelector(".lap-house");
const colourNote = document.querySelector("#lap-colour-note");

swatches.forEach((button) => button.addEventListener("click", () => {
  const [name, note, wall, trim, shutters] = paint[button.dataset.tone];
  swatches.forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)));
  house.style.setProperty("--wall", wall);
  house.style.setProperty("--trim", trim);
  house.style.setProperty("--shutters", shutters);
  house.classList.remove("lap-cladding");
  requestAnimationFrame(() => requestAnimationFrame(() => house.classList.add("lap-cladding")));
  const label = document.createElement("strong");
  label.textContent = name;
  colourNote.replaceChildren(label, ` · ${note}`);
}));
