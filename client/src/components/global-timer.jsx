import { useAppStore } from "@/store";
import React, { useEffect, useRef } from "react";
import Timer from "./timer/timer";
import TimeInput from "./timeInput/time-input";

const GlobalTimer = ({ handleSubmit }) => {
  const { userData } = useAppStore();
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && isMounted) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.warn("Wake Lock error:", err);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        wakeLockRef.current === null
      ) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);

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
