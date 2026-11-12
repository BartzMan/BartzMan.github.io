const crossSection = document.querySelector('.cross-section');
const layerButtons = crossSection.querySelectorAll('[data-layer]');
const layerNotes = document.querySelectorAll('[data-note]');

crossSection.addEventListener('click', event => {
  const chosen = event.target.closest('[data-layer]');
  if (!chosen) return;
  layerButtons.forEach(button => button.setAttribute('aria-pressed', button === chosen));
  layerNotes.forEach(note => { note.hidden = note.dataset.note !== chosen.dataset.layer; });
});

const facilitySelector = document.querySelector('.facility-selector');
const facilityButtons = facilitySelector.querySelectorAll('[data-select]');
const facilityRows = document.querySelectorAll('[data-facility]');

facilitySelector.addEventListener('click', event => {
  const chosen = event.target.closest('[data-select]');
  if (!chosen) return;
  const row = document.getElementById('service-' + chosen.dataset.select);
  facilityButtons.forEach(button => button.setAttribute('aria-pressed', button === chosen));
  facilityRows.forEach(entry => entry.toggleAttribute('data-selected', entry === row));
  row.scrollIntoView({ block: 'start' });
});
