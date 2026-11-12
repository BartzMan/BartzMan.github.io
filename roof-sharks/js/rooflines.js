const pairedContent = [
  { controls: '.roof-avenue', pressed: 'data-roof-key', copy: 'data-roof-copy' },
  { controls: '.decision-switch', pressed: 'data-branch', copy: 'data-branch-copy' },
];

for (const { controls, pressed, copy } of pairedContent) {
  const selection = document.querySelector(controls);
  const reading = document.querySelectorAll('[' + copy + ']');
  selection.addEventListener('click', event => {
    const picked = event.target.closest('button[' + pressed + ']');
    if (!picked) return;
    const previous = selection.querySelector('[aria-pressed=true]');
    previous.setAttribute('aria-pressed', 'false');
    picked.setAttribute('aria-pressed', 'true');
    reading.forEach(note => { note.hidden = note.getAttribute(copy) !== picked.getAttribute(pressed); });
  });
}
