
const layerButtons = [...document.querySelectorAll("[data-envelope]")];
const cutPaths = [...document.querySelectorAll("[data-cut]")];
const views = [...document.querySelectorAll(".cutaway-view")];

function activateLayer(layer) {
  layerButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.envelope === layer)));
  cutPaths.forEach((path) => path.classList.toggle("is-current-layer", path.dataset.cut === layer));
  views.forEach((view) => { view.hidden = view.id !== "layer-" + layer; });
}
layerButtons.forEach((button) => button.addEventListener("click", () => activateLayer(button.dataset.envelope)));
activateLayer("green");

const filters = [...document.querySelectorAll("[data-e-filter]")];
const items = [...document.querySelectorAll("[data-envelope-type]")];
filters.forEach((button) => button.addEventListener("click", () => {
  const type = button.dataset.eFilter;
  filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
  items.forEach((item) => { item.hidden = type !== "all" && item.dataset.envelopeType !== type; });
  document.querySelector(".envelope-film").scrollLeft = 0;
}));


