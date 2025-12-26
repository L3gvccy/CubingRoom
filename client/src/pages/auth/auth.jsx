import React, { useState } from "react";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import AuthSideBar from "./components/auth-side-bar";

const Auth = () => {
  const [authAction, setAuthAction] = useState("login");
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-[90vw] max-w-180 h-[90vh] max-h-120 bg-zinc-700 rounded-lg shadow-2xl">
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
  );
};

export default Auth;
