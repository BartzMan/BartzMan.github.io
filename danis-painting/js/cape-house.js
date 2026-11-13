const elevation = document.querySelector('.cape-sheet');
if (elevation) {
  const labels = elevation.querySelectorAll('[data-cape]');
  const houseParts = elevation.querySelectorAll('[data-house-part]');
  const descriptions = elevation.querySelectorAll('[data-cape-note]');
  function showPart(key) {
    for (const label of labels) label.setAttribute('aria-pressed', String(label.dataset.cape === key));
    for (const part of houseParts) part.classList.toggle('selected', part.dataset.housePart === key);
    for (const description of descriptions) description.hidden = description.dataset.capeNote !== key;
  }
  for (const label of labels) label.addEventListener('click', () => showPart(label.dataset.cape));
  for (const part of houseParts) part.addEventListener('click', () => showPart(part.dataset.housePart));
  showPart('siding');
}

const servicePicker = document.querySelector('.painting-choices');
if (servicePicker) {
  servicePicker.addEventListener('click', (event) => {
    const chosen = event.target.closest('[data-coat]');
    if (!chosen) return;
    for (const button of servicePicker.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === chosen));
    for (const panel of document.querySelectorAll('[data-coat-panel]')) panel.hidden = panel.dataset.coatPanel !== chosen.dataset.coat;
  });
}
