import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import { createToken } from "../utils/utils.js";

export const getMe = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Користувача не знайдено");
    }

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервера");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email та пароль обов'язкові");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("Користувача з такою поштою не знайдено");
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(400).send("Невірний праоль");
    }

    res.cookie("jwt", createToken(user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email та пароль обов'язкові");
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).send("Користувач з такою поштою вже існує");
    }

    const user = await User.create({ email: email, password: password });

    res.cookie("jwt", createToken(user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({ user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Ви успішно вийшли з акаунту");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
