/**
 * PO Launcher: the presets as one compact row. Each category (Step Ladder, Glitched,
 * Tournament) is a button that drops down its presets; "All presets" is the searchable list.
 * Same data and the same applyPreset as the full PresetSection, just folded up.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allPresets, presetCategories, getPresetById } from "@/data/launcherPresets";

interface PoPresetBarProps {
  nextLadder: { presetId: string; name: string; time: Date } | null;
  applyPreset: (presetId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = { ladder: "Step Ladder", glitched: "Glitched", tournament: "Tournament" };

export function PoPresetBar({ nextLadder, applyPreset }: PoPresetBarProps) {
  const [open, setOpen] = useState<string | null>(null);   // category id, "all", or null
  const [search, setSearch] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  // Any click outside the bar closes whatever is open
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(null);
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", key); };
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return allPresets;
    const q = search.toLowerCase();
    return allPresets.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [search]);

  const toggle = (id: string) => { setOpen((cur) => (cur === id ? null : id)); setSearch(""); };
  const pick = (presetId: string) => { applyPreset(presetId); setOpen(null); };

  const item = (p: { id: string; name: string; description: string }) => (
    <button
      type="button"
      key={p.id}
      onClick={() => pick(p.id)}
      className="flex flex-col w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
    >
      <span className="text-xs font-medium">{p.name}</span>
      <span className="text-[10px] text-muted-foreground">{p.description}</span>
    </button>
  );

  return (
    <section ref={barRef} className="flex flex-wrap items-center gap-2">
      <span className="po-label mr-1">Presets</span>

      {presetCategories.map((cat) => (
        <div key={cat.id} className="relative">
          <Button variant="outline" size="sm" className="cursor-pointer" aria-expanded={open === cat.id} onClick={() => toggle(cat.id)}>
            {CATEGORY_LABELS[cat.id] ?? cat.title}
            <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open === cat.id ? "rotate-180" : ""}`} />
          </Button>
          {open === cat.id && (
            <div className="absolute left-0 top-full mt-1 z-50 w-64 border bg-popover text-popover-foreground shadow-md py-1">
              {cat.presetIds.map((pid) => { const p = getPresetById(pid); return p ? item(p) : null; })}
            </div>
          )}
        </div>
      ))}

      {nextLadder && (
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => pick(nextLadder.presetId)} title="Load the next Step Ladder race preset">
          <Timer className="size-3.5" />
          Next ladder: {nextLadder.name}
          <span className="text-[10px] text-muted-foreground">
            {nextLadder.time.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
          </span>
        </Button>
      )}

      <div className="relative ml-auto">
        <Button variant="outline" size="sm" className="cursor-pointer" aria-expanded={open === "all"} onClick={() => toggle("all")}>
          <Search className="size-3.5 text-muted-foreground" />
          All presets
          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open === "all" ? "rotate-180" : ""}`} />
        </Button>
        {open === "all" && (
          <div className="absolute right-0 top-full mt-1 z-50 w-72 border bg-popover text-popover-foreground shadow-md">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search presets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-7 pl-7 pr-2 border border-input bg-transparent text-xs outline-none focus:border-ring"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0
                ? <div className="px-3 py-4 text-xs text-muted-foreground text-center">No presets found</div>
                : filtered.map(item)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
