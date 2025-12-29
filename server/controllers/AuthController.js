import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {};

export const register = async (req, res) => {};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Ви успішно вийшли з акаунту");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
