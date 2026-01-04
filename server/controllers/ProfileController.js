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

export const updateName = async (req, res) => {
  try {
    const { userId } = req;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).send("Ім'я не введено");
    }

    await User.findOneAndUpdate({ _id: userId }, { displayName: newName });

    const updatedUser = await User.findOne({ _id: userId });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const updateTimerType = async (req, res) => {
  try {
    const { userId } = req;
    const { type } = req.body;

    if (!type) {
      return res.status(400).send("Тип таймеру не вказано");
    }

    await User.findOneAndUpdate({ _id: userId }, { timerType: type });

    const updatedUser = await User.findOne({ _id: userId });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
