import { getScrambles } from "cubicdb-module";

export const generateScramble = async (req, res) => {
  try {
    const { event, length } = req.body;

    const scramble = getScrambles([
      { scrambler: event, length: length, image: true },
    ])[0];

    res.status(200).json({ scramble });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
