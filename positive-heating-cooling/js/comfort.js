const checker = document.querySelector('.symptom-panel fieldset');
const prompt = document.querySelector('.comfort-prompt');

checker.addEventListener('change', event => {
  const chosen = event.target;
  document.querySelector('[data-advice="' + chosen.dataset.symptom + '"]').hidden = !chosen.checked;
  prompt.hidden = Boolean(checker.querySelector('input:checked'));
});

const choices = document.querySelector('.climate-choices');
choices.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  choices.querySelector('[aria-pressed=true]').setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-system]').forEach(panel => { panel.hidden = panel.dataset.system !== button.value; });
});
