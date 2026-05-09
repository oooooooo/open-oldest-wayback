# Agent Guidelines

## Project Overview

This repository contains a single userscript, `open-oldest-wayback.user.js`, that opens
the oldest available `200 OK` Wayback Machine snapshot for the current page.

Keep changes small and focused. Prefer direct, browser-compatible JavaScript over adding
build tooling or runtime dependencies.

## Commands

- `npm run check`: Run Biome checks for formatting and linting.
- `npm run format`: Format files with Biome.

## Coding Style

- Use plain JavaScript that can run directly as a userscript.
- Preserve the userscript metadata block at the top of `open-oldest-wayback.user.js`.
- Use 2-space indentation and keep lines at or below 100 characters.
- Prefer `const` and `let`; do not use `var`.
- Keep user-facing messages clear and short.
- Avoid alert dialogs; use the existing non-blocking status message pattern.

## Userscript Behavior

- Do not run actions while the user is typing in input, textarea, select, or editable
  content.
- Keep the default shortcut as `Alt+Shift+I` unless the README and metadata are updated
  together.
- Use `GM_xmlhttpRequest` for Internet Archive CDX API requests.
- Keep `@connect`, `@updateURL`, and `@downloadURL` in sync with any endpoint or repository
  changes.

## Testing

After changing behavior, run `npm run check` and manually test the userscript in a
userscript manager such as Tampermonkey or Violentmonkey.
