import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Divider from "../../../components/divider";

const RegisterForm = ({ setAuthAction }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswod, setShowPasswod] = useState(false);

  return (
    <div className="w-full grid px-2 gap-5 items-center dark:text-zinc-100">
      <div>
        <p className="text-xl font-semibold text-center">Реєстрація</p>
        <p className="text-sm text-center">
          Вже маєте акаунт?{" "}
          <button
            className="cursor-pointer underline text-green-500"
            onClick={() => {
              setAuthAction("login");
            }}
          >
            Увійти
          </button>
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full flex px-2 items-center rounded-md bg-zinc-800">
          <MdAlternateEmail className="text-xl text-zinc-400" />
          <input
            type="text"
            className="flex-1 outline-0 p-2"
            placeholder="Email"
          />
        </div>
        <div className="w-full flex px-2 items-center rounded-md bg-zinc-800">
          <IoKey className="text-xl text-zinc-400" />
          <input
            type={showPasswod ? "text" : "password"}
            className="flex-1 outline-0 p-2"
            placeholder="Пароль"
          />
          <div
            className="cursor-pointer text-xl text-zinc-400 hover:text-zinc-300 transition-all duration-300"
            onClick={() => {
              setShowPasswod((prev) => !prev);
            }}
          >
            {showPasswod ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <div className="w-full flex px-2 items-center rounded-md bg-zinc-800">
          <IoKey className="text-xl text-zinc-400" />
          <input
            type={showPasswod ? "text" : "password"}
            className="flex-1 outline-0 p-2"
            placeholder="Повтор паролю"
          />
          <div
            className="cursor-pointer text-xl text-zinc-400 hover:text-zinc-300 transition-all duration-300"
            onClick={() => {
              setShowPasswod((prev) => !prev);
            }}
          ></div>
        </div>
        <button
          type="submit"
          className="p-2 bg-green-700 hover:bg-green-600 active:bg-green-800 rounded-md cursor-pointer transition-all duration-300"
        >
          Зареєструватись
        </button>
      </div>
      <Divider>Або</Divider>
      <div className="flex gap-2 bg-zinc-200 hover:bg-zinc-100 active:bg-zinc-300 text-zinc-900 items-center justify-center py-2 rounded-md cursor-pointer">
        <img src="WCALogo.png" alt="wca logo" height="20px" width="20px" />
        <span>Увійти через WCA ID</span>
      </div>
    </div>
  );
};

export default RegisterForm;
