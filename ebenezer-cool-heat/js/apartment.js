const drawing = document.querySelector('.cutaway-drawing');
drawing.addEventListener('click', event => {
  const device = event.target.closest('[data-device]');
  if (!device) return;
  drawing.querySelector('[aria-pressed=true]').setAttribute('aria-pressed', 'false');
  device.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-device-note]').forEach(note => { note.hidden = note.dataset.deviceNote !== device.dataset.device; });
});
document.querySelectorAll('[data-building-mode]').forEach(mode => {
  mode.addEventListener('click', () => {
    document.querySelector('.bronx-modes [aria-pressed=true]').setAttribute('aria-pressed', 'false');
    mode.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('[data-mode-file]').forEach(file => { file.hidden = file.dataset.modeFile !== mode.dataset.buildingMode; });
  });
});
