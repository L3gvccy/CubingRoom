import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        navigate("/");
      }}
    >
      <img src="CubingLogo.png" alt="Logo" className="w-10" />
      <p className="text-2xl font-thin text-zinc-100">CubiX</p>
    </div>
  );
};

export default HeaderLogo;
