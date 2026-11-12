const quarters = document.querySelector('.quarter-rail');
quarters.addEventListener('click', ({ target }) => {
  const active = target.closest('[data-quarter]');
  if (!active) return;
  quarters.querySelector('[aria-pressed=true]').setAttribute('aria-pressed', 'false');
  active.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-season-note]').forEach(note => {
    note.hidden = note.dataset.seasonNote !== active.dataset.quarter;
  });
});
const filterFactors = document.querySelector('.filter-editor fieldset');
filterFactors.addEventListener('change', ({ target }) => {
  document.querySelectorAll('[data-filter-note]').forEach(note => {
    note.hidden = note.dataset.filterNote !== target.value;
  });
});
