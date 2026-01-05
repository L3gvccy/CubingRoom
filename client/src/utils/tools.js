export const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const getTimerColor = (state) => {
  switch (state) {
    case "holding":
      return "text-red-400";
    case "ready":
      return "text-emerald-400";
    case "running":
      return "text-zinc-100";
    case "stopped":
      return "text-zinc-400";
    default:
      return "text-zinc-100";
  }
};

export const getScrambler = (event) => {
  const wca_events = {
    333: ["333", 0],
    222: ["222so", 0],
    444: ["444wca", 0],
    555: ["555wca", 60],
    666: ["666wca", 80],
    777: ["777wca", 100],
    "333oh": ["333", 0],
    clock: ["clkwca", 0],
    megaminx: ["mgmp", 70],
    pyraminx: ["pyrso", 10],
    skewb: ["skbso", 0],
    sq1: ["sqrs", 0],
  };

  return wca_events[event];
};

export const formatTimeDisplay = (time, penalty) => {
  let totalMs = Math.floor(time);

  if (penalty === "+2") {
    totalMs += 2000;
  }

  const ms = Math.floor((totalMs % 1000) / 10);

  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  let formatted;

  if (minutes > 0) {
    formatted = `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  } else {
    formatted = `${seconds}.${ms.toString().padStart(2, "0")}`;
  }

  if (penalty === "DNF") return `DNF(${formatted})`;
  if (penalty === "+2") return `${formatted}+`;
  return formatted;
};

export const parseTimeInput = (value) => {
  if (!value) return null;

  const clean = value.toString().replace(/[^\d]/g, "");

  if (!/^\d+$/.test(clean)) return null;

  let minutes = 0;
  let seconds = 0;
  let centiseconds = 0;

  if (clean.length <= 2) {
    centiseconds = Number(clean.padStart(2, "0"));
  } else if (clean.length <= 4) {
    seconds = Number(clean.slice(0, -2));
    centiseconds = Number(clean.slice(-2));
  } else {
    minutes = Number(clean.slice(0, -4));
    seconds = Number(clean.slice(-4, -2));
    centiseconds = Number(clean.slice(-2));
  }

  return minutes * 60 * 1000 + seconds * 1000 + centiseconds * 10;
};

export const compareDate = (a, b) => {
  return a.toDateString() === b.toDateString();
};

export const getNameAndFormat = (event) => {
  const wca_events = {
    333: ["3x3", "ao5"],
    222: ["2x2", "ao5"],
    444: ["4x4", "ao5"],
    555: ["5x5", "ao5"],
    666: ["6x6", "mo3"],
    777: ["7x7", "mo3"],
    "333oh": ["3x3 OH", "ao5"],
    clock: ["Clock", "ao5"],
    megaminx: ["Megaminx", "ao5"],
    pyraminx: ["Pyraminx", "ao5"],
    skewb: ["Skewb", "ao5"],
    sq1: ["Square-1", "ao5"],
  };

  return wca_events[event];
};
