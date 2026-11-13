const meter = document.querySelector('.meter-housing');
if (meter) {
  const controls = document.querySelectorAll('[data-space]');
  const readings = meter.querySelectorAll('[data-reading]');
  const needle = meter.querySelector('.lux-needle');
  const band = meter.querySelector('.lux-band');

  function point(value) {
    const angle = Math.PI * value / 600;
    return `${160 - 103 * Math.cos(angle)} ${155 - 103 * Math.sin(angle)}`;
  }

  function calibrate(control) {
    const space = control.dataset.space;
    for (const button of controls) button.setAttribute('aria-pressed', String(button === control));
    for (const reading of readings) reading.hidden = reading.dataset.reading !== space;
    const active = meter.querySelector(`[data-reading="${space}"]`);
    const low = Number(active.dataset.low);
    const high = Number(active.dataset.high);
    const middle = (low + high) / 2;
    needle.style.transform = `rotate(${middle * .3}deg)`;
    band.setAttribute('d', `M ${point(low)} A 103 103 0 0 1 ${point(high)}`);
  }

  for (const control of controls) control.addEventListener('click', () => calibrate(control));
  calibrate(controls[0]);
}

const applications = document.querySelector('.application-controls');
if (applications) {
  const views = document.querySelectorAll('[data-market-panel]');
  applications.addEventListener('click', (event) => {
    const selected = event.target.closest('[data-market]');
    if (!selected) return;
    for (const button of applications.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    for (const view of views) view.hidden = view.dataset.marketPanel !== selected.dataset.market;
  });
}
