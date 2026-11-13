const scene = document.querySelector('[data-scene]');
if (scene) {
  const times = scene.querySelectorAll('[data-time]');
  const descriptions = scene.querySelectorAll('[data-scene-text]');
  for (const control of times) {
    control.addEventListener('click', () => {
      scene.dataset.scene = control.dataset.time;
      for (const button of times) button.setAttribute('aria-pressed', String(button === control));
      for (const text of descriptions) text.hidden = text.dataset.sceneText !== control.dataset.time;
    });
  }
}

const lighting = document.querySelector('.lighting-picks');
if (lighting) {
  const exhibits = document.querySelectorAll('[data-light-service]');
  function showSelectedService() {
    const selected = lighting.querySelector('input:checked').value;
    for (const exhibit of exhibits) exhibit.hidden = exhibit.dataset.lightService !== selected;
  }
  lighting.addEventListener('change', showSelectedService);
  showSelectedService();
}

const gardenNotes = document.querySelector('.arrival-path');
if (gardenNotes) {
  const noteButtons = gardenNotes.querySelectorAll('[data-garden-note]');
  const noteCopy = gardenNotes.querySelectorAll('[data-note-copy]');
  const lightMap = document.querySelector('.light-map');
  function illuminateNote(index) {
    for (const button of noteButtons) button.setAttribute('aria-pressed', String(button.dataset.gardenNote === index));
    for (const text of noteCopy) text.hidden = text.dataset.noteCopy !== index;
    lightMap.dataset.highlight = index;
  }
  for (const button of noteButtons) button.addEventListener('click', () => illuminateNote(button.dataset.gardenNote));
  illuminateNote('0');
}
