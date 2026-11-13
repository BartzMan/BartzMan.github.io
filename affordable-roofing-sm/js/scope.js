const folderTabs = document.querySelectorAll('[data-surface]');
const samples = document.querySelectorAll('[data-surface-sheet]');

if (folderTabs.length) {
  function fileSurface(name) {
    for (const tab of folderTabs) {
      tab.setAttribute('aria-pressed', String(tab.dataset.surface === name));
    }
    for (const sample of samples) {
      sample.hidden = sample.dataset.surfaceSheet !== name;
    }
  }

  for (const tab of folderTabs) {
    tab.addEventListener('click', () => fileSurface(tab.dataset.surface));
  }
  fileSurface('pitch');
}

const worksheet = document.querySelector('.proof-ticks');
if (worksheet) {
  const count = document.querySelector('.proof-count');
  worksheet.addEventListener('change', () => {
    count.value = `${worksheet.querySelectorAll(':checked').length} of 6 lines marked`;
  });
}
