function connectSelector(triggerAttribute, panelAttribute) {
  const buttons = [...document.querySelectorAll(`[${triggerAttribute}]`)];
  const panels = [...document.querySelectorAll(`[${panelAttribute}]`)];
  if (!buttons.length) return;

  function select(active) {
    const choice = active.getAttribute(triggerAttribute);
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === active));
    }
    for (const panel of panels) {
      panel.hidden = panel.getAttribute(panelAttribute) !== choice;
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => select(button));
  }
  select(buttons[0]);
}

connectSelector('data-job', 'data-job-sheet');
connectSelector('data-profile', 'data-section-profile');
