const forecast = document.querySelector('.four-fronts');
forecast.addEventListener('click', event => {
  const button = event.target.closest('[data-front]');
  if (!button) return;
  forecast.querySelector('[aria-pressed=true]').setAttribute('aria-pressed','false');
  button.setAttribute('aria-pressed','true');
  document.getElementById('main').dataset.weather = button.dataset.front;
  document.querySelectorAll('[data-weather-note]').forEach(note => { note.hidden = note.dataset.weatherNote !== button.dataset.front; });
});
document.querySelector('.shape-switch').addEventListener('click', event => {
  const button = event.target.closest('[data-roof-mode]');
  if (!button) return;
  document.querySelector('.shape-switch [aria-pressed=true]').setAttribute('aria-pressed','false');
  button.setAttribute('aria-pressed','true');
  document.querySelectorAll('[data-shape-note]').forEach(note => { note.hidden = note.dataset.shapeNote !== button.dataset.roofMode; });
});
