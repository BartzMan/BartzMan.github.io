
const seasonChoices = [...document.querySelectorAll("[data-season-choice]")];
const seasonRecords = [...document.querySelectorAll(".garden-season-record")];

function featureSeason(season) {
  document.body.dataset.season = season;
  seasonChoices.forEach((choice) => choice.setAttribute("aria-pressed", String(choice.dataset.seasonChoice === season)));
  seasonRecords.forEach((record) => { record.hidden = record.id !== "season-" + season; });
}
seasonChoices.forEach((choice) => choice.addEventListener("click", () => featureSeason(choice.dataset.seasonChoice)));
featureSeason("summer");

