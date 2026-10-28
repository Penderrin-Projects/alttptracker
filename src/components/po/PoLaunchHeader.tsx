/**
 * PO Launcher: the slim bar at the top of the Launch page, in place of the site header.
 * A label in the launcher's style and the autotracker connection, nothing else.
 */
interface PoLaunchHeaderProps {
  autotrackStatus: "checking" | "connected" | "disconnected";
  autotrackProtocol: "sni" | "qusb2snes";
  autotrackHost: string;
  autotrackPort: number;
}

export function PoLaunchHeader({ autotrackStatus, autotrackProtocol, autotrackHost, autotrackPort }: PoLaunchHeaderProps) {
  const device = autotrackProtocol === "sni" ? "SNI" : "QUsb2snes";
  const where = `${autotrackHost}:${autotrackPort}`;
  const dot =
    autotrackStatus === "connected" ? "bg-green-500" :
    autotrackStatus === "checking" ? "bg-yellow-500 animate-pulse" :
    "bg-red-500/80";
  const text =
    autotrackStatus === "connected" ? `${device} connected · ${where}` :
    autotrackStatus === "checking" ? `Looking for ${device} at ${where}…` :
    `No ${device} at ${where}`;
  return (
    <header className="flex items-center justify-between h-9 px-4 border-b border-border">
      <span className="po-label">Tracker setup</span>
      <span className="flex items-center gap-2 text-xs text-muted-foreground" title="Autotracking connection (change it under Tracker Settings)">
        <span className={`inline-block size-2 rounded-full ${dot}`} />
        <span className="po-mono">{text}</span>
      </span>
    </header>
  );
}
