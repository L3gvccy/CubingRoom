import { generateScrambles, getNameAndFormat } from "../utils/utils.js";

const contests_to_create = [333, 222, 777, "skewb"];

export const createContests = async () => {
  contests_to_create.forEach((event) => {
    const [name, format] = getNameAndFormat(event);
    console.log(`Generating contest for ${name}, format: ${format}`);

    const scrambles = generateScrambles(event, true);
    console.log("Scrambles:", scrambles);
  });
};
