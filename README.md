# Resistor Color Code Calculator (Chrome Extension)

This repository contains a Chrome Extension that provides a **Resistor Color Code Calculator** supporting 4-band, 5-band, and 6-band resistors. The tool is embedded inside the extension so it works offline.

## Contents
- `manifest.json` — Chrome extension manifest (MV3)
- `popup.html` — extension popup which loads the tool
- `resistor-color-code-calculator.html` — the tool UI page
- `styles.css` — styling
- `main.js` — JavaScript logic (no inline scripts)
- `icons/` — extension icons

## Local testing
1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select this project folder.
5. Click the extension icon to open the popup.

## Publish to Chrome Web Store
1. Zip the folder (or pack extension via `chrome://extensions`).
2. Create a developer account on Chrome Web Store (one-time fee).
3. Upload the zip, fill in details/screenshots/privacy policy, and submit for review.

## License
MIT — see `LICENSE` for details.
