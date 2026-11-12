const roofGraphic = document.querySelector('.coastal-graphic');
roofGraphic.addEventListener('click', event => {
  const hotspot = event.target.closest('[data-fog-point]');
  if (!hotspot) return;
  roofGraphic.querySelector('[aria-pressed=true]').setAttribute('aria-pressed','false');
  hotspot.setAttribute('aria-pressed','true');
  roofGraphic.dataset.activeFog = hotspot.dataset.fogPoint;
  document.querySelectorAll('[data-fog-note]').forEach(note => { note.hidden = note.dataset.fogNote !== hotspot.dataset.fogPoint; });
});
const decisionSwitch = document.querySelector('.damp-switch');
decisionSwitch.addEventListener('click', event => {
  const choice = event.target.closest('button');
  if (!choice) return;
  decisionSwitch.querySelector('[aria-pressed=true]').setAttribute('aria-pressed','false');
  choice.setAttribute('aria-pressed','true');
  document.querySelectorAll('[data-damp-note]').forEach(note => { note.hidden = note.dataset.dampNote !== choice.dataset.dampMode; });
});
