const enabledInput = document.querySelector('#enabled');
const status = document.querySelector('#status');

const render = (enabled) => {
  enabledInput.checked = enabled;
  status.textContent = enabled ? 'Active on Max pages' : 'Paused';
};

chrome.storage.local.get({ enabled: true }, ({ enabled }) => render(enabled));

enabledInput.addEventListener('change', () => {
  const enabled = enabledInput.checked;
  chrome.storage.local.set({ enabled });
  render(enabled);
});
