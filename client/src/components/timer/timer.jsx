import { TimerProvider } from "@/context/timerContext";
import React from "react";
import TimerMini from "./timer-mini";
import TimerFullscreen from "./timer-fullscreen";

const Timer = ({ handleSubmit }) => {
  return (
    <TimerProvider onFinish={handleSubmit}>
      <TimerMini />
      <TimerFullscreen />
    </TimerProvider>
  );
};

export default Timer;
