
const statusChoices = [...document.querySelectorAll("[data-ticket]")];
const statusViews = [...document.querySelectorAll(".dispatch-ticket-detail")];

function showTicket(ticket) {
  statusChoices.forEach((choice) => choice.setAttribute("aria-pressed", String(choice.dataset.ticket === ticket)));
  statusViews.forEach((view) => { view.hidden = view.id !== "ticket-" + ticket; });
}
statusChoices.forEach((choice) => choice.addEventListener("click", () => showTicket(choice.dataset.ticket)));
showTicket("called");

const profileChoices = [...document.querySelectorAll("[data-roof-profile]")];
const profileViews = [...document.querySelectorAll(".dispatch-profile-view")];

function showRoof(profile) {
  profileChoices.forEach((choice) => choice.setAttribute("aria-pressed", String(choice.dataset.roofProfile === profile)));
  profileViews.forEach((view) => { view.hidden = view.id !== "profile-" + profile; });
}
profileChoices.forEach((choice) => choice.addEventListener("click", () => showRoof(choice.dataset.roofProfile)));
showRoof("shingle");

