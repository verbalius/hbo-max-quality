(() => {
  const QUALITY_PATTERN = /(?:2160|4k|uhd|ultra\s*hd)/i;
  const SETTINGS_PATTERN = /settings|quality|video|playback/i;
  const STORAGE_KEY = 'enabled';
  const MENU_TIMEOUT_MS = 10000;
  const SCAN_INTERVAL_MS = 1200;

  let enabled = true;
  let menuAttemptUntil = 0;
  let scanTimer;

  const isVisible = (element) => {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  };

  const labelFor = (element) => [
    element.getAttribute('aria-label'),
    element.getAttribute('title'),
    element.textContent
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  const clickHighestQualityOption = () => {
    const candidates = [...document.querySelectorAll('button, [role="button"], [role="menuitem"], [role="option"], li')]
      .filter(isVisible)
      .filter((element) => QUALITY_PATTERN.test(labelFor(element)));

    if (candidates.length === 0) return false;

    const preferred = candidates.find((element) => /2160|4k/i.test(labelFor(element))) || candidates[0];
    preferred.click();
    return true;
  };

  const openSettingsMenu = () => {
    const controls = [...document.querySelectorAll('button, [role="button"]')]
      .filter(isVisible)
      .filter((element) => SETTINGS_PATTERN.test(labelFor(element)));

    const settingsButton = controls.find((element) => /settings/i.test(labelFor(element))) || controls[0];
    if (!settingsButton) return false;

    settingsButton.click();
    menuAttemptUntil = Date.now() + MENU_TIMEOUT_MS;
    return true;
  };

  const enforceQuality = () => {
    if (!enabled) return;
    if (clickHighestQualityOption()) {
      menuAttemptUntil = 0;
      return;
    }

    if (Date.now() < menuAttemptUntil) return;
    openSettingsMenu();
  };

  const scan = () => {
    enforceQuality();
    scanTimer = window.setTimeout(scan, SCAN_INTERVAL_MS);
  };

  chrome.storage.local.get({ [STORAGE_KEY]: true }, (settings) => {
    enabled = settings[STORAGE_KEY] !== false;
    scan();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return;
    enabled = changes[STORAGE_KEY].newValue !== false;
    menuAttemptUntil = 0;
    if (!enabled && scanTimer) {
      window.clearTimeout(scanTimer);
      scanTimer = undefined;
    }
    if (enabled && !scanTimer) scan();
  });

  const observer = new MutationObserver(() => {
    if (enabled) enforceQuality();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
