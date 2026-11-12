
const stones = [...document.querySelectorAll("[data-stone]")];
const finishes = [...document.querySelectorAll("[data-finish]")];
const stoneInfo = {
  quartz: ["Quartz", "Engineered quartz often has a more consistent pattern across a surface."],
  granite: ["Granite", "Granite patterns and colour shift from one slab to another."],
  marble: ["Marble", "Marble has natural veins and can develop visible changes with use."]
};
const finishInfo = { navy: ["navy","#33465f"], cream: ["cream","#e5d9c1"], oak: ["oak","#986f49"] };
const drawing = document.querySelector(".kitchen-elevation");
const counter = document.querySelector("#stone-counter");
const description = document.querySelector("#studio-note");
let stone = "quartz";
let finish = "navy";

function showSample() {
  const [name, note] = stoneInfo[stone];
  const [colour, paint] = finishInfo[finish];
  stones.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stone === stone)));
  finishes.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.finish === finish)));
  drawing.style.setProperty("--cabinet", paint);
  counter.setAttribute("fill", "url(#" + stone + "-grain)");
  const label = document.createElement("strong");
  label.textContent = name + " with " + colour + " cabinets.";
  description.replaceChildren(label, " " + note);
}
stones.forEach((button) => button.addEventListener("click", () => {
  stone = button.dataset.stone;
  showSample();
}));
finishes.forEach((button) => button.addEventListener("click", () => {
  finish = button.dataset.finish;
  showSample();
}));

const rooms = [...document.querySelectorAll("[data-room]")];
const entries = [...document.querySelectorAll(".finish-register-entry")];
function openRoom(id) {
  rooms.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.room === id)));
  entries.forEach((entry) => { entry.hidden = entry.id !== id; });
}
rooms.forEach((button) => button.addEventListener("click", () => openRoom(button.dataset.room)));
openRoom("kitchen-file");

