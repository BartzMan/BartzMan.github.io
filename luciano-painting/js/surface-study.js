const surface = document.querySelector('.surface-display');
if (surface) {
  const range = document.querySelector('#surface-range');
  const stageButtons = document.querySelectorAll('[data-stage]');
  const stageNote = document.querySelector('.stage-note');
  function showAmount() {
    surface.style.setProperty('--shown', `${range.value}%`);
  }
  range.addEventListener('input', showAmount);
  for (const button of stageButtons) {
    button.addEventListener('click', () => {
      surface.dataset.treatment = button.dataset.stage;
      for (const candidate of stageButtons) candidate.setAttribute('aria-pressed', String(button === candidate));
      stageNote.textContent = button.dataset.stage === 'paint'
        ? 'Once the cleaned surface dries, a new coating changes the wall color.'
        : 'Washing lifts surface grime from the wall and driveway.';
    });
  }
  const art = surface.querySelector('.surface-art');
  function revealAt(event) {
    const bounds = art.getBoundingClientRect();
    range.value = String(Math.round((event.clientX - bounds.left) / bounds.width * 100));
    showAmount();
  }
  art.addEventListener('pointerdown', (event) => {
    art.setPointerCapture(event.pointerId);
    revealAt(event);
  });
  art.addEventListener('pointermove', (event) => {
    if (art.hasPointerCapture(event.pointerId)) revealAt(event);
  });
  showAmount();
}

const servicePicks = document.querySelector('.paint-picks');
if (servicePicks) {
  const cards = document.querySelectorAll('[data-finish-card]');
  servicePicks.addEventListener('click', (event) => {
    const active = event.target.closest('[data-finish]');
    if (!active) return;
    for (const button of servicePicks.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === active));
    for (const card of cards) card.hidden = card.dataset.finishCard !== active.dataset.finish;
  });
}
