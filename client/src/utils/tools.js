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

export const formatTimeDisplay = (time, penalty) => {
  const ms = Math.floor(time % 1000);
  const totalSeconds = Math.floor(time / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  const formatted = `${minutes > 0 ? minutes + ":" : ""}${seconds
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(3, "0").slice(0, 2)}`;

  if (penalty === "DNF") return `DNF(${formatted})`;
  if (penalty === "+2") return `${formatted}+`;
  return formatted;
};
