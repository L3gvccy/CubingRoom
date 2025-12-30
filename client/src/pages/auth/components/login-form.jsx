import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../../components/divider";
import WcaIdBtn from "./wca-id-btn";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { useAppStore } from "@/store";

const LoginForm = ({ setAuthAction }) => {
  const navigate = useNavigate();
  const { setUserData } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswod, setShowPasswod] = useState(false);

  const handleLoginClick = async () => {
    if (!email) {
      toast.error("Email обов'язковий");
      return;
    }
    if (!password) {
      toast.error("Пароль обов'язковий");
      return;
    }
    await apiClient
      .post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Ви успішно увійшли");
          setUserData(res.data.user);
          navigate("/");
          return;
        }
      })
      .catch((err) => {
        if (err.response.status !== 500) {
          toast.error(err.response?.data);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className="w-full grid px-2 py-4 gap-5 items-center dark:text-zinc-100">
      <div className="dark:text-zinc-100">
        <p className="text-xl font-semibold text-center">Вхід</p>
        <p className="text-sm text-center">
          Ще не маєте акаунту?{" "}
          <button
            className="cursor-pointer underline text-violet-700 dark:text-violet-300"
            onClick={() => {
              setAuthAction("register");
            }}
          >
            Зареєструватись
          </button>
        </p>
      </div>
      <div className="grid gap-3">
        <div className="w-full flex px-2 items-center rounded-md bg-zinc-200 dark:bg-zinc-800">
          <MdAlternateEmail className="text-xl text-zinc-400" />
          <input
            type="text"
            className="flex-1 outline-0 p-2 dark:text-zinc-100"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="w-full flex px-2 items-center rounded-md bg-zinc-200 dark:bg-zinc-800">
          <IoKey className="text-xl text-zinc-400" />
          <input
            type={showPasswod ? "text" : "password"}
            className="flex-1 outline-0 p-2 dark:text-zinc-100"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
        <button
          type="submit"
          className="p-2 text-zinc-100 bg-violet-700 hover:bg-violet-600 active:bg-violet-800 rounded-md cursor-pointer transition-all duration-300"
          onClick={handleLoginClick}
        >
          Увійти
        </button>
      </div>
      <Divider>Або</Divider>
      <WcaIdBtn />
    </div>
  );
};

export default LoginForm;
