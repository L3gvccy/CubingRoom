import { useAppStore } from "@/store";
import React from "react";
import Timer from "./timer/timer";
import TimeInput from "./timeInput/time-input";

const GlobalTimer = ({ handleSubmit }) => {
  const { userData } = useAppStore();
  return (
    <div className="w-full">
      {userData.timerType === "KEYBOARD" ? (
        <Timer handleSubmit={handleSubmit} />
      ) : (
        <TimeInput handleSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default GlobalTimer;
