/**
 * True when this page is running inside the ALTTPR PO Launcher (its preload exposes
 * window.electronAPI). The launcher shows the tracker in its own windows, so the Launch page
 * drops its site chrome (header, notices, footer) and takes the launcher's look.
 */
declare global {
  interface Window { electronAPI?: { isElectron?: boolean } }
}

export const isPoLauncher: boolean = typeof window !== "undefined" && !!window.electronAPI?.isElectron;
