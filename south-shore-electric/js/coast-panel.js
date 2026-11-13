const panel = document.querySelector('.panel-chart');
if (panel) {
  const parts = panel.querySelectorAll('[data-part]');
  const buttons = panel.querySelectorAll('[data-breaker]');
  const notes = panel.querySelectorAll('[data-breaker-note]');
  function highlight(key) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.breaker === key));
    for (const part of parts) part.classList.toggle('is-selected', part.dataset.part === key);
    for (const note of notes) note.hidden = note.dataset.breakerNote !== key;
  }
  for (const button of buttons) button.addEventListener('click', () => highlight(button.dataset.breaker));
  for (const part of parts) part.addEventListener('click', () => highlight(part.dataset.part));
  highlight('main');
}

const property = document.querySelector('.shore-select');
if (property) {
  const views = document.querySelectorAll('[data-property]');
  function selectProperty() {
    const selected = property.querySelector('input:checked').value;
    for (const view of views) view.hidden = view.dataset.property !== selected;
  }
  property.addEventListener('change', selectProperty);
  selectProperty();
}
