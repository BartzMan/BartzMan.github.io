const sectionDrawing = document.querySelector('.roof-section-figure');
sectionDrawing.addEventListener('click', event => {
  const graphic = event.target.closest('[data-drawn-part]');
  const part = graphic
    ? sectionDrawing.querySelector('[data-section-part="' + graphic.dataset.drawnPart + '"]')
    : event.target.closest('[data-section-part]');
  if (!part) return;
  sectionDrawing.querySelector('[aria-pressed=true]').setAttribute('aria-pressed', 'false');
  part.setAttribute('aria-pressed', 'true');
  sectionDrawing.dataset.activePart = part.dataset.sectionPart;
  document.querySelectorAll('[data-section-note]').forEach(note => {
    note.hidden = note.dataset.sectionNote !== part.dataset.sectionPart;
  });
});
const tradeToggle = document.querySelector('.trade-toggle');
tradeToggle.addEventListener('click', event => {
  const choice = event.target.closest('button');
  if (!choice) return;
  tradeToggle.querySelector('[aria-pressed=true]').setAttribute('aria-pressed', 'false');
  choice.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-miller-note]').forEach(note => {
    note.hidden = note.dataset.millerNote !== choice.dataset.millerService;
  });
});
