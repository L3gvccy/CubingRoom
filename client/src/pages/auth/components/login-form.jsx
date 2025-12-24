import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [showPasswod, setShowPasswod] = useState(false);

  return (
    <div className="w-full h-full grid px-2 py-4 gap-5 items-center dark:text-zinc-100">
      <div>
        <p className="text-xl font-semibold text-center">Вхід</p>
        <p className="text-sm text-center">
          Ще не маєте акаунту?{" "}
          <button className="cursor-pointer underline text-green-500">
            Зареєструватись
          </button>
        </p>
      </div>
      <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
};

export default LoginForm;
