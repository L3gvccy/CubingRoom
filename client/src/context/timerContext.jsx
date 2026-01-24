import { useTimer } from "@/components/timer/hooks/useTimer.jsx";
import { createContext, useContext } from "react";

const TimerContext = createContext(null);

export const TimerProvider = ({ children, onFinish }) => {
  const timer = useTimer({ onFinish });
  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
};

export const useGlobalTimer = () => useContext(TimerContext);
