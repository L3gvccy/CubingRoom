import jwt from "jsonwebtoken";
import { getScrambles } from "cubicdb-module";

export const maxAge = 3 * 24 * 60 * 60 * 1000;

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
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

export const generateScrambles = (event, multiple = false) => {
  const [name, format] = getNameAndFormat(event);
  const [scrambler, length] = getScrambler(event);
  if (multiple) {
    let scrambles = [];

    const amount = format === "ao5" ? 5 : 3;
    for (let i = 0; i < amount; i++) {
      const scramble = getScrambles([
        { scrambler: scrambler, length: length, image: true },
      ])[0];

      scrambles = [...scrambles, scramble];
    }

    return scrambles;
  } else {
    return getScrambles([
      { scrambler: scrambler, length: length, image: true },
    ])[0];
  }
};
