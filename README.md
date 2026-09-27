# Max 4K Quality Enforcer

A Manifest V3 Chrome extension that keeps trying to select Max's highest visible player quality, including 4K/UHD when Max offers it.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select this folder.
5. Open Max, start a title, and leave the extension enabled.

## Important limitations

The extension can operate Max's visible quality menu, but it cannot bypass Max's adaptive bitrate logic, DRM, plan restrictions, title availability, device certification, or network conditions. If Max does not expose a 4K/UHD option, the extension cannot create one.

The site may change its player markup. The content script uses accessible labels and visible text rather than private APIs, so its selectors may need updating after a Max player redesign.
