import React from "react";

const LinkWcaBtn = () => {
  return (
    <div
      className="flex max-w-60 gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-100 dark:bg-zinc-200 dark:hover:bg-zinc-100 dark:active:bg-zinc-300 dark:text-zinc-900 items-center justify-center py-2 rounded-md cursor-pointer transition-all duration-300"
      onClick={() => {
        window.location.href = "http://localhost:3001/api/wca/link";
      }}
    >
      <img src="/WCALogo.png" alt="wca logo" height="20px" width="20px" />
      <span>Прив'язати WCA ID</span>
    </div>
  );
};

export default LinkWcaBtn;
