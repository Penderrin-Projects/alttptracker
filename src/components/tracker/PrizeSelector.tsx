import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementPrizeCount } from "@/store/dungeonsSlice";
import { cn } from "@/lib/utils";
import { PrizeImages } from "@/data/itemData";

interface PrizeSelectorProps {
  dungeon: string;
  className?: string;
}

function PrizeSelector({ dungeon, className }: PrizeSelectorProps) {
  const dispatch = useDispatch();
  const trackedPrize = useSelector((state: RootState) => state.dungeons[dungeon]?.prize || "unknown");
  const prizeCollected = useSelector((state: RootState) => state.dungeons[dungeon]?.prizeCollected || false);
  // While the prize is unknown, draw the user's chosen placeholder instead of the question mark.
  // Only the picture changes: clicking still cycles from "unknown", and autotracking still writes the real prize.
  const defaultPrize = useSelector((state: RootState) => state.settings.defaultPrize ?? "unknown");
  const prize = trackedPrize === "unknown" ? defaultPrize : trackedPrize;

  return (
    <div
      key={`${dungeon}-prize`}
      className={cn(`border-2 ${prizeCollected ? "border-green-600" : "border-red-600"}`, className)}
      onClick={() => dispatch(incrementPrizeCount({ dungeon, decrement: false }))}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(incrementPrizeCount({ dungeon, decrement: true }));
      }}
      style={{
        backgroundImage: `url(${PrizeImages[prize]})`,
        opacity: prizeCollected ? 1 : 0.7,
        backgroundPosition: "center",
        backgroundSize: (prize === "greenPendant" || prize === "pendant") ? "90%" : "110%",
        imageRendering: "smooth",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    </div>
  );
}

export default PrizeSelector;
