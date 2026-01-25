import React from "react";
import { formatTimeDisplay, getTimerColor } from "@/utils/tools";
import { useGlobalTimer } from "@/context/timerContext";

const TimerMini = () => {
  const { time, state, onPointerDown, onPointerUp, onPointerCancel } =
    useGlobalTimer();
  return (
    <div
      className={`px-4 py-10 md:py-6 select-none touch-none bg-transparent font-mono text-4xl text-center ${getTimerColor(
        state,
      )}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {formatTimeDisplay(time)}
    </div>
  );
};

export default TimerMini;
