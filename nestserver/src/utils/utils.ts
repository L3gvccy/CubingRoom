export const getScrambler = (event: string) => {
  const wcaEvents = {
    "333": { scrambler: "333", length: 0 },
    "222": { scrambler: "222so", length: 0 },
    "444": { scrambler: "444wca", length: 0 },
    "555": { scrambler: "555wca", length: 60 },
    "666": { scrambler: "666wca", length: 80 },
    "777": { scrambler: "777wca", length: 100 },
    "333oh": { scrambler: "333", extra: 0 },
    clock: { scrambler: "clkwca", length: 0 },
    megaminx: { scrambler: "mgmp", length: 70 },
    pyraminx: { scrambler: "pyrso", length: 10 },
    skewb: { scrambler: "skbso", length: 0 },
    sq1: { scrambler: "sqrs", length: 0 },
    "333bf": { scrambler: "333ni", length: 0 },
    "444bf": { scrambler: "444bld", length: 40 },
    "555bf": { scrambler: "555bld", length: 60 },
  };

  return wcaEvents[event];
};

export const event_format = [
  ["333", "ao5"],
  ["222", "ao5"],
  ["444", "ao5"],
  ["555", "ao5"],
  ["666", "mo3"],
  ["777", "mo3"],
  ["333oh", "ao5"],
  ["clock", "ao5"],
  ["megaminx", "ao5"],
  ["pyraminx", "ao5"],
  ["skewb", "ao5"],
  ["sq1", "ao5"],
  ["333bf", "ao5"],
  ["444bf", "mo3"],
  ["555bf", "mo3"],
];
