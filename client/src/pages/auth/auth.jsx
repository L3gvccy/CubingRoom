import React, { useState } from "react";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import AuthSideBar from "./components/auth-side-bar";
import ThemeToggler from "@/components/themeToggler";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Auth = () => {
  const [authAction, setAuthAction] = useState("login");
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-zinc-100 dark:bg-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-[90vw] max-w-180 h-[90vh] max-h-120 bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-2xl">
          <div className="hidden md:flex-1 md:flex">
            <AuthSideBar />
          </div>
          <div className="w-full h-full flex items-center px-3">
            {authAction === "login" ? (
              <LoginForm setAuthAction={setAuthAction} />
            ) : (
              <RegisterForm setAuthAction={setAuthAction} />
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggler />
      </div>
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="text-xl text-zinc-400 hover:text-zinc-300 active:text-zinc-500 transition-all duration-300"
        >
          <IoMdArrowBack />
        </Link>
      </div>
    </>
  );
};

export default Auth;
