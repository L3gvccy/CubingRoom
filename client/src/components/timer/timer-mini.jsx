import React from "react";
import { getTimerColor } from "@/utils/tools";
import { useGlobalTimer } from "@/context/timerContext";

const TimerMini = () => {
  const { time, state } = useGlobalTimer();
  return (
    <div
      className={`px-4 py-6  bg-transparent font-mono text-4xl text-center ${getTimerColor(
        state
      )}`}
    >
      {(time / 1000).toFixed(2)}
    </div>
  );
};

export default TimerMini;
