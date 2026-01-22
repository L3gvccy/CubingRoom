import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer({ onFinish } = {}) {
  const [state, setState] = useState("idle");
  const [time, setTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);

  const startTime = useRef(0);
  const raf = useRef(null);
  const holdTimeout = useRef(null);

  const tick = () => {
    const t = performance.now() - startTime.current;
    setTime(t);
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

    const finalRawTime = performance.now() - startTime.current;
    const floored = Math.floor(finalRawTime);

    // 🔑 КЛЮЧОВЕ: синхронізуємо дисплей і фінал
    setTime(floored);

    setPendingResult({
      time: floored,
      penalty: "OK",
    });

    setState("stopped");
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
      finalTime = Number.MAX_SAFE_INTEGER;
    }

    const finalResult = {
      time: pendingResult.time,
      penalty,
      finalTime,
    };

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
      if (e.code !== "Space") return;

      const el = document.activeElement;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

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

  const onPointerDown = useCallback(
    (e) => {
      if (e.pointerType === "mouse") return;

      if (state === "idle") {
        setState("holding");
        holdTimeout.current = setTimeout(() => setState("ready"), 300);
      }
      if (state === "running") stop();
    },
    [state, stop],
  );

  const onPointerUp = useCallback(
    (e) => {
      if (e.pointerType === "mouse") return;

      if (holdTimeout.current) clearTimeout(holdTimeout.current);

      if (state === "ready") start();
      if (state === "holding") setState("idle");
    },
    [state, start],
  );

  return {
    time,
    state,
    isFullscreen,
    pendingResult,
    chooseResult,
    reset,
    onPointerDown,
    onPointerUp,
  };
}
