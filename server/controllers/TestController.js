import { getScrambles } from "cubicdb-module";

export const generateScramble = async (req, res) => {
  try {
    const { event } = req.body;
    console.log(event);

    const scramble = getScrambles([{ scrambler: event, image: true }])[0];

    res.status(200).json({ scramble });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
