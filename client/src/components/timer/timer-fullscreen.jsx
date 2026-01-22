import React, { useEffect } from "react";
import { formatTimeDisplay, getTimerColor } from "@/utils/tools";
import { useGlobalTimer } from "@/context/timerContext";

const TimerFullscreen = () => {
  const { time, state, isFullscreen, pendingResult, chooseResult } =
    useGlobalTimer();

  const onEnterPress = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      chooseResult("OK");
    } else if (e.key === "Escape") {
      chooseResult("reset");
    }
  };

  useEffect(() => {
    if (isFullscreen && state === "stopped" && pendingResult) {
      window.addEventListener("keydown", onEnterPress);

      return () => {
        window.removeEventListener("keydown", onEnterPress);
      };
    }
  }, [isFullscreen, pendingResult]);

  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-8">
      <div
        className={`font-mono text-6xl transition-colors ${getTimerColor(
          state,
        )}`}
      >
        {formatTimeDisplay(time, "OK")}
      </div>

      {state === "stopped" && pendingResult && (
        <div className="flex gap-2">
          <button
            className="text-lg py-2 px-6 rounded-md text-zinc-100 bg-orange-400 cursor-pointer"
            onClick={() => chooseResult("PLUS2")}
          >
            +2
          </button>
          <button
            className="text-lg py-2 px-6 rounded-md text-zinc-100 bg-red-400 cursor-pointer"
            onClick={() => chooseResult("DNF")}
          >
            DNF
          </button>
          <button
            className="text-lg py-2 px-6 rounded-md text-zinc-100 bg-emerald-400 cursor-pointer"
            onClick={() => chooseResult("OK")}
          >
            OK
          </button>
          <button
            className="text-lg py-2 px-6 rounded-md text-zinc-100 bg-zinc-700 cursor-pointer"
            onClick={() => chooseResult("reset")}
          >
            RESET
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerFullscreen;
