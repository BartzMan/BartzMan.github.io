const printStrip = document.querySelector('.contact-print');
const seek = printStrip.querySelector('#frame-seek');
const frames = Array.from(printStrip.querySelectorAll('[data-oak-frame]'));
const frameKeys = Array.from(printStrip.querySelectorAll('[data-oak-select]'));

function exposeFrame(number) {
  seek.value = number;
  frames.forEach(frame => { frame.hidden = frame.dataset.oakFrame !== number; });
  frameKeys.forEach(key => key.setAttribute('aria-pressed', key.dataset.oakSelect === number));
}

seek.addEventListener('input', () => exposeFrame(seek.value));
frameKeys.forEach(key => key.addEventListener('click', () => exposeFrame(key.dataset.oakSelect)));
