import Contest from "../models/ContestModel.js";
import { generateScrambles, getNameAndFormat } from "../utils/utils.js";

const contests_to_create = [
  "333",
  "222",
  "444",
  "555",
  "666",
  "777",
  "333oh",
  "clock",
  "megaminx",
  "pyraminx",
  "skewb",
  "sq1",
];

export const createContests = async () => {
  await Contest.updateMany({ active: true }, { active: false });
  for (const event of contests_to_create) {
    const [name, format] = getNameAndFormat(event);
    console.log(`Generating contest for ${name}, format: ${format}`);

    const scrambles = generateScrambles(event, true);
    await Contest.create({
      event: event,
      format: format,
      scrambles: scrambles,
    });
  }
};
