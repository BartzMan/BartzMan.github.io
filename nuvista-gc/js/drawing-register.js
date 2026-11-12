const sequence = document.querySelector(".sequence-film");
const note = document.querySelector("#sequence-note");
const stages = {
  existing: ["Measure the existing room.", "Note the walls, doors, windows and spots where work happens every day."],
  layout: ["Lay out the work zones.", "Compare the paths between the sink, cooking area and refrigerator before choosing a layout."],
  materials: ["Select the surfaces.", "Look at cabinet, counter and flooring samples side by side in the room’s light."],
  finish: ["Review the finished details.", "Check how doors, drawers and appliances open, and confirm the final details that need attention."]
};

sequence.addEventListener("click", (event) => {
  const current = event.target.closest("[data-sequence]");
  if (!current) return;
  for (const item of sequence.querySelectorAll("button")) item.setAttribute("aria-pressed", String(item === current));
  const [heading, body] = stages[current.dataset.sequence];
  const title = document.createElement("strong");
  title.textContent = heading;
  note.replaceChildren(title, " " + body);
});
