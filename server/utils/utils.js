import jwt from "jsonwebtoken";

export const maxAge = 3 * 24 * 60 * 60 * 1000;

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};
