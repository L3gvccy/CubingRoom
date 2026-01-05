import Contest from "../models/ContestModel.js";

export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();

    return res.status(200).json({ contests });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const getContest = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findOne({ _id: contestId });

    if (!contest) {
      return res.status(404).send("Контест не знайдено");
    }

    return res.status(200).json({ contest });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
