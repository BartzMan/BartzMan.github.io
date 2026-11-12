const bayControls = document.querySelectorAll('.bank-samples, .season-parcels');
for (const region of bayControls) {
  const isCalendar = region.classList.contains('season-parcels');
  const key = isCalendar ? 'data-bay-stage' : 'data-roof-bank';
  const notes = isCalendar ? 'data-stage-note' : 'data-bank-note';
  region.addEventListener('click', event => {
    const selection = event.target.closest('button');
    if (!selection) return;
    region.querySelector('[aria-pressed=true]').setAttribute('aria-pressed','false');
    selection.setAttribute('aria-pressed','true');
    document.querySelectorAll('[' + notes + ']').forEach(note => { note.hidden = note.getAttribute(notes) !== selection.getAttribute(key); });
  });
}
