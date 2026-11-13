const cutaway = document.querySelector('.duct-house');
if (cutaway) {
  const buttons = cutaway.querySelectorAll('[data-room]');
  const areas = cutaway.querySelectorAll('[data-room-hotspot]');
  const notes = cutaway.querySelectorAll('[data-room-note]');
  function showRoom(room) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.room === room));
    for (const area of areas) area.classList.toggle('selected', area.dataset.roomHotspot === room);
    for (const note of notes) note.hidden = note.dataset.roomNote !== room;
  }
  for (const button of buttons) button.addEventListener('click', () => showRoom(button.dataset.room));
  for (const area of areas) area.addEventListener('click', () => showRoom(area.dataset.roomHotspot));
  showRoom('0');
}

const hearth = document.querySelector('.hearth-tabs');
if (hearth) {
  hearth.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-hearth]');
    if (!choice) return;
    for (const button of hearth.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === choice));
    for (const view of document.querySelectorAll('[data-hearth-panel]')) view.hidden = view.dataset.hearthPanel !== choice.dataset.hearth;
  });
}
