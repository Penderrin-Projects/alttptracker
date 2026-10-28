# `po` branch — Muffins Tracker 2.0 for the ALTTPR PO Launcher

This branch is `react_rewrite` plus a few small commits for the
[ALTTPR PO Launcher](https://github.com/Penderrin-Projects/alttpr-po-launcher), which embeds the built tracker:

- **Default dungeon prize marker** — a remembered setting (Launch page → Tracker Settings) for the marker drawn while a dungeon's prize is unknown; blue crystal by default. Only the picture changes: clicking still cycles from unknown and autotracking still writes the real prize.
- **Launcher colour themes** — `window.applyPoTheme(name)` recolours the design tokens to the launcher's charcoal ground and accent; inert on the hosted tracker.
- **`/tracker?last=1`** — recreates what the Launch page launched last, so the launcher can open the tracker straight into the user's usual game. Direct launches also open their popouts and put the session id in the address bar.
- **Scale above 1:1** — the tracker and map popout grow with their window.
- **Map marker size** — a remembered setting (Tracker Settings, 50-200%, default 100%) for the size of the location markers on the maps; entrance-label placement follows.
- **Launcher look** (only when `window.electronAPI.isElectron` is set by the launcher's preload): the Launch page drops the site header, notices and footer for a slim bar with the autotracker status, folds the preset categories into dropdown buttons, and takes the launcher's IBM Plex fonts, small radii and mono labels (`src/po-launcher.css`, scoped to `html[data-po-theme]`).

Updating: `git fetch upstream && git rebase upstream/react_rewrite`, resolve, force-push `po`, then bump the pinned commit in the launcher's `tracker-source.json`.
