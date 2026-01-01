import User from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const editable = userId === id;

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send("Користувача не знайдено");
    }

    return res.status(200).json({ user, editable });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
