import React, { useState } from "react";
import LoginForm from "./components/login-form";

const Auth = () => {
  const [authAction, setAuthAction] = useState("login");
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-[90vw] max-w-160 bg-zinc-700 rounded-lg">
        <div className="hidden md:flex-1 md:flex items-center justify-center gap-2">
          <p className="text-white">CubingRoom</p>
        </div>
        <div className="flex-1">
          {authAction === "login" ? <LoginForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
