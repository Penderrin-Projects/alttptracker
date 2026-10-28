/**
 * PO Launcher colour themes.
 *
 * The ALTTPR PO Launcher (https://github.com/Penderrin-Projects/alttpr-po-launcher) embeds this
 * tracker and lets the user pick an accent colour for the launcher. The launcher calls
 * `window.applyPoTheme(name)` in every tracker window so the tracker follows that choice; the
 * name is kept in localStorage so later windows start with it before the launcher says anything.
 *
 * Nothing here runs unless a theme was applied at least once, so the hosted tracker is unchanged.
 * The theme only overrides the shadcn design tokens (inline on <html>, which beats the .dark /
 * .light rules); the user's own colours (status colours, app background) are left alone.
 */

import { isPoLauncher } from "./poLauncher";

const CHARCOAL = {
  background: "#141517",
  panel: "#1b1d21",
  input: "#101113",
  hover: "#22252a",
  border: "#26282d",
  borderLight: "#33363d",
  text: "#ececec",
  mutedText: "#9a9ea6",
};

// Same accents as the launcher's renderer.js — keep the two tables in step.
const ACCENTS: Record<string, { accent: string; hover: string }> = {
  amber:  { accent: "#e8a33d", hover: "#f2b95c" },
  orange: { accent: "#e07a4a", hover: "#ef9668" },
  red:    { accent: "#e0604f", hover: "#ec7f70" },
  green:  { accent: "#5cb883", hover: "#7ccb9c" },
  teal:   { accent: "#5fb0a5", hover: "#7fc6bc" },
  blue:   { accent: "#6ea8e8", hover: "#8cbdf0" },
  purple: { accent: "#b391e0", hover: "#c6ace9" },
  slate:  { accent: "#c9c4b8", hover: "#dedad0" },
};
// Launcher themes from before its 2.3.0 release.
const LEGACY: Record<string, string> = { midnight: "amber", black: "slate", ember: "red", yellow: "amber" };

export const PO_THEME_KEY = "poTheme";

export function applyPoTheme(rawName: string): void {
  const name = LEGACY[rawName] || rawName;
  const theme = ACCENTS[name] || ACCENTS.amber;
  const root = document.documentElement;
  const set = (k: string, v: string) => root.style.setProperty(k, v);

  set("--background", CHARCOAL.background);
  set("--foreground", CHARCOAL.text);
  set("--card", CHARCOAL.panel);
  set("--card-foreground", CHARCOAL.text);
  set("--popover", CHARCOAL.panel);
  set("--popover-foreground", CHARCOAL.text);
  set("--primary", theme.accent);
  set("--primary-foreground", CHARCOAL.background);
  set("--secondary", CHARCOAL.hover);
  set("--secondary-foreground", CHARCOAL.text);
  set("--muted", CHARCOAL.hover);
  set("--muted-foreground", CHARCOAL.mutedText);
  set("--accent", CHARCOAL.hover);
  set("--accent-foreground", CHARCOAL.text);
  set("--border", CHARCOAL.border);
  set("--input", CHARCOAL.borderLight);
  set("--ring", theme.accent);
  set("--sidebar", CHARCOAL.panel);
  set("--sidebar-primary", theme.accent);
  set("--sidebar-primary-foreground", CHARCOAL.background);
  set("--sidebar-accent", CHARCOAL.hover);
  set("--sidebar-border", CHARCOAL.border);
  set("--sidebar-ring", theme.accent);
  set("--po-accent", theme.accent);
  set("--po-accent-hover", theme.hover);
  root.dataset.poTheme = name;

  try { localStorage.setItem(PO_THEME_KEY, name); } catch { /* storage unavailable */ }
}

declare global {
  interface Window { applyPoTheme?: (name: string) => void }
}

export function installPoTheme(): void {
  window.applyPoTheme = applyPoTheme;
  let saved: string | null = null;
  try { saved = localStorage.getItem(PO_THEME_KEY); } catch { /* storage unavailable */ }
  if (saved) applyPoTheme(saved);
  else if (isPoLauncher) applyPoTheme("amber");   // the launcher's default; it sends the real choice right after load
}
