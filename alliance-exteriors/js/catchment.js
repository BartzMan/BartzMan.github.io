const runoff = document.querySelector('[data-runoff]');

if (runoff) {
  const points = {
    roof: ['01', 'Roof', 'Overlapping shingles shed water down the slope. Missing tabs leave the layers below exposed to rain.'],
    valley: ['02', 'Valley', 'The valley collects water where two roof slopes meet. Debris can slow runoff where the water is most concentrated.'],
    edge: ['03', 'Drip edge', 'This strip guides water clear of the roof edge. A displaced edge can let water track back against the trim.'],
    gutter: ['04', 'Gutter', 'The trough collects water from the roof. Spills over one spot can point to debris or a sag.'],
    drop: ['05', 'Downspout', 'The downspout carries water from the gutter to ground level. Water spilling from a joint may point to a blockage or a loose connection.'],
    ground: ['06', 'Splash block', 'The splash block directs water away from the wall. A puddle next to the foundation can show that the outlet is too close or has shifted.']
  };

  const controls = runoff.querySelectorAll('[data-point]');
  const reading = runoff.querySelector('.runoff-reading');
  for (const button of controls) {
    button.addEventListener('click', () => {
      const [number, title, description] = points[button.dataset.point];
      for (const control of controls) {
        control.setAttribute('aria-pressed', String(control === button));
      }
      reading.querySelector('.gauge-label').textContent = `${number} / 06`;
      reading.querySelector('h3').textContent = title;
      reading.querySelector('p:last-child').textContent = description;
    });
  }
}

const serviceChoices = document.querySelectorAll('input[name="shed"]');
const servicePanels = document.querySelectorAll('[data-trade]');

function updateServices() {
  const current = document.querySelector('input[name="shed"]:checked');
  for (const panel of servicePanels) {
    panel.hidden = panel.dataset.trade !== current.value;
  }
}

if (serviceChoices.length) {
  for (const radio of serviceChoices) {
    radio.addEventListener('change', updateServices);
  }
  updateServices();
}
