import { useState, useEffect, useRef } from "react";

export function useTimer({ onFinish } = {}) {
  const [state, setState] = useState("idle");
  const [time, setTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);

  const startTime = useRef(0);
  const raf = useRef(null);
  const holdTimeout = useRef(null);

  const tick = () => {
    setTime(performance.now() - startTime.current);
    raf.current = requestAnimationFrame(tick);
  };

  const start = () => {
    startTime.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    setIsFullscreen(true);
    setState("running");
  };

  const stop = () => {
    cancelAnimationFrame(raf.current);
    const finalTime = performance.now() - startTime.current;
    setState("stopped");
    setPendingResult({ time: finalTime, penalty: "OK" });
  };

  const chooseResult = (penalty) => {
    if (!pendingResult) return;

    if (penalty === "reset") {
      reset();
      return;
    }

    let finalTime = pendingResult.time;

    if (penalty === "PLUS2") {
      finalTime += 2000;
    }

    if (penalty === "DNF") {
      finalTime = Infinity;
    }

    const finalResult = { time: pendingResult.time, penalty, finalTime };
    setPendingResult(null);
    setIsFullscreen(false);
    setTime(0);
    setState("idle");

    if (onFinish) onFinish(finalResult);
  };

  const reset = () => {
    cancelAnimationFrame(raf.current);
    setPendingResult(null);
    setIsFullscreen(false);
    setTime(0);
    setState("idle");
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      e.preventDefault();
      if (!e.code || e.code !== "Space" || e.repeat) return;

      const activeTag = document.activeElement?.tagName;
      const editable = document.activeElement?.isContentEditable;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT" ||
        editable
      ) {
        return;
      }

      if (state === "idle") {
        setState("holding");
        holdTimeout.current = setTimeout(() => setState("ready"), 300);
      }

      if (state === "running") stop();
    };

    const onKeyUp = (e) => {
      if (e.code !== "Space") return;

      clearTimeout(holdTimeout.current);

      if (state === "ready") start();
      if (state === "holding") setState("idle");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state]);

  return {
    time,
    state,
    isFullscreen,
    pendingResult,
    chooseResult,
    reset,
  };
}
