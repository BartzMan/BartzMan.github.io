const setting = document.querySelector('#setpoint');
if (setting) {
  const output = document.querySelector('.degrees');
  const pointer = document.querySelector('.dial-pointer');
  const summer = document.querySelector('[data-summer]');
  const winter = document.querySelector('[data-winter]');

  function showSetting() {
    const degrees = setting.valueAsNumber;
    output.textContent = `${degrees}°F`;
    pointer.style.transform = `rotate(${-125 + (degrees - 62) * 250 / 22}deg)`;
    summer.textContent = degrees < 72
      ? 'A very low setpoint asks for more cooling. Lowering it further usually will not cool the room faster.'
      : degrees < 77
        ? 'Make a small adjustment, then give the room time to settle.'
        : 'A higher cooling setting lets the room warm before cooling starts. Check whether the rooms you use feel comfortable.';
    winter.textContent = degrees < 68
      ? 'A lower heating setpoint lets the room cool farther before heat starts.'
      : degrees < 73
        ? 'Compare the room reading with the setpoint and check whether occupied rooms feel even.'
        : 'A higher setting asks the system to keep heating until the room reaches it.';
  }

  setting.addEventListener('input', showSetting);
  for (const button of document.querySelectorAll('[data-shift]')) {
    button.addEventListener('click', () => {
      setting.stepUp(Number(button.dataset.shift));
      showSetting();
    });
  }
  showSetting();
}

const mode = document.querySelector('.system-switch');
if (mode) {
  mode.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-system]');
    if (!choice) return;
    for (const button of mode.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === choice));
    for (const panel of document.querySelectorAll('[data-system-view]')) panel.hidden = panel.dataset.systemView !== choice.dataset.system;
  });
}
