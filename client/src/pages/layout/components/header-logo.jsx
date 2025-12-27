import React from "react";

const HeaderLogo = () => {
  return (
    <div className="flex gap-2 items-center cursor-pointer">
      <img src="CubingLogo.png" alt="Logo" className="w-10" />
      <p className="text-2xl font-thin text-green-500">CubiX</p>
    </div>
  );
};

export default HeaderLogo;
