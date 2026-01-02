import axios from "axios";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/UserModel.js";
import { createToken, maxAge } from "../utils/utils.js";
import mongoose from "mongoose";

export const redirectToWcaID = (req, res) => {
  const params = querystring.stringify({
    client_id: process.env.WCA_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.WCA_REDIRECT_URI,
  });
  return res.redirect(
    `https://www.worldcubeassociation.org/oauth/authorize?${params}`
  );
};

export const WcaIDCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400);

  try {
    const tokenRes = await axios.post(
      "https://www.worldcubeassociation.org/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        client_id: process.env.WCA_CLIENT_ID,
        client_secret: process.env.WCA_CLIENT_SECRET,
        redirect_uri: process.env.WCA_REDIRECT_URI,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    const meRes = await axios.get(
      "https://www.worldcubeassociation.org/api/v0/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const wca = meRes.data.me;

    const existingUser = await User.findOne({ wcaId: wca.wca_id });

    if (existingUser) {
      res.cookie("jwt", createToken(existingUser.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });
    } else {
      const newUser = await User.create({
        wcaId: wca.wca_id,
        wcaName: wca.name,
        image: wca.avatar.id ? wca.avatar.url : undefined,
        countryCode: wca.country_iso2,
      });
      res.cookie("jwt", createToken(newUser.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });
    }

    return res.redirect(`${process.env.ORIGIN}/wca-success`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка авторизації");
  }
};

export const redirectToWcaIDLink = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("wca_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 5 * 60 * 1000,
  });

  const params = querystring.stringify({
    client_id: process.env.WCA_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.WCA_LINK_REDIRECT_URI,
    state,
  });
  return res.redirect(
    `https://www.worldcubeassociation.org/oauth/authorize?${params}`
  );
};

export const WcaIDLinkCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Invalid callback");
  }

  try {
    if (state !== req.cookies.wca_state) {
      return res.status(403).send("Invalid state");
    }

    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send("Not authenticated");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const tokenRes = await axios.post(
      "https://www.worldcubeassociation.org/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        client_id: process.env.WCA_CLIENT_ID,
        client_secret: process.env.WCA_CLIENT_SECRET,
        redirect_uri: process.env.WCA_LINK_REDIRECT_URI,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    const meRes = await axios.get(
      "https://www.worldcubeassociation.org/api/v0/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const wca = meRes.data.me;

    const alreadyLinked = await User.findOne({
      wcaId: wca.wca_id,
      _id: { $ne: userId },
    });

    if (alreadyLinked) {
      return res
        .status(409)
        .send("Цей WCA акаунт вже привʼязаний до іншого користувача");
    }

    await User.findByIdAndUpdate(userId, {
      wcaId: wca.wca_id,
      wcaName: wca.name,
      image: wca.avatar.id ? wca.avatar.url : undefined,
      countryCode: wca.country_iso2,
    });

    res.clearCookie("wca_state");

    return res.redirect(`${process.env.ORIGIN}/wca-link-success`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка авторизації");
  }
};
