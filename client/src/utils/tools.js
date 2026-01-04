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
  const totalMs = Math.floor(time);

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
