# Open Oldest Wayback

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Install](https://img.shields.io/badge/Install-userscript-brightgreen)](https://github.com/oooooooo/open-oldest-wayback/raw/main/open-oldest-wayback.user.js)

Open the oldest available Wayback Machine snapshot for the page you are currently viewing.

## Features

- Fetches the oldest `200 OK` snapshot from the Internet Archive CDX API.
- Opens the snapshot in the current tab.
- Shows a centered, non-blocking status message while fetching.
- Avoids running while you are typing in input, textarea, select, or editable content.

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. [Click here to install](https://github.com/oooooooo/open-oldest-wayback/raw/main/open-oldest-wayback.user.js).

## Usage

1. Open any web page.
2. Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>.
3. Wait for the "Fetching the oldest snapshot..." status message.
4. If a snapshot exists, the current tab navigates to the oldest archived version.

## Notes

- The script uses the Internet Archive CDX API at `https://web.archive.org/cdx`.
- If no snapshot is found, it shows a non-blocking message instead of an alert dialog.
- <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> is used because <kbd>Ctrl</kbd>+<kbd>I</kbd> often conflicts with browser or editor shortcuts.
