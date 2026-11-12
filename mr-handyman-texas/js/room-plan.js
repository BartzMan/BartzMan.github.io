
const toolRooms = [...document.querySelectorAll("[data-tool-room]")];
const files = [...document.querySelectorAll(".tool-room-file")];

function openRoom(room) {
  toolRooms.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.toolRoom === room)));
  files.forEach((file) => { file.hidden = file.id !== "room-" + room; });
}
toolRooms.forEach((button) => button.addEventListener("click", () => openRoom(button.dataset.toolRoom)));
openRoom("yard");


