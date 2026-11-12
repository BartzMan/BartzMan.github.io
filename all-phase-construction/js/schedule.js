const range = document.querySelector("#phase-selector");
const output = document.querySelector("#phase-current");
const stageTabs = [...document.querySelectorAll("[data-stage]")];
const track = document.querySelector(".phase-track");
const stagePanels = [...track.querySelectorAll(".phase-entry")];

function readStage(number) {
  range.value = number;
  const label = stagePanels[number - 1].querySelector("h3").textContent;
  output.value = `0${number} / ${label}`;
  stageTabs.forEach((tab) => tab.setAttribute("aria-pressed", String(Number(tab.dataset.stage) === number)));
}

function showStage(number) {
  readStage(number);
  const offset = stagePanels[number - 1].getBoundingClientRect().left - track.getBoundingClientRect().left;
  track.scrollLeft += offset - 4;
}

range.addEventListener("input", () => showStage(Number(range.value)));
stageTabs.forEach((tab) => tab.addEventListener("click", () => showStage(Number(tab.dataset.stage))));
track.addEventListener("scrollend", () => {
  const left = track.getBoundingClientRect().left;
  const current = stagePanels.findIndex((stage) => stage.getBoundingClientRect().right > left + track.clientWidth * .45);
  if (current >= 0) readStage(current + 1);
});

const filters = [...document.querySelectorAll("[data-phase-filter]")];
const services = [...document.querySelectorAll("[data-phase-category]")];
filters.forEach((button) => button.addEventListener("click", () => {
  const selected = button.dataset.phaseFilter;
  filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
  services.forEach((service) => {
    const type = service.dataset.phaseCategory;
    service.hidden = selected !== "all" && type !== selected && type !== "both";
  });
  document.querySelector(".phase-service-grid").scrollLeft = 0;
}));
