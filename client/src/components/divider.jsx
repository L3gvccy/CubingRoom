import React from "react";

const Divider = ({ children }) => {
  return (
    <div className="relative flex py-5 items-center">
      <div className="grow border-t border-gray-400"></div>
      <span className="shrink mx-4 text-gray-400">{children}</span>
      <div className="grow border-t border-gray-400"></div>
    </div>
  );
};

export default Divider;
