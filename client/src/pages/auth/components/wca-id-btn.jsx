import { apiClient } from "@/lib/api-client";
import { WCA_AUTH_ROUTE } from "@/utils/constants";
import React from "react";

const WcaIdBtn = () => {
  return (
    <div
      className="flex gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-100 dark:bg-zinc-200 dark:hover:bg-zinc-100 dark:active:bg-zinc-300 dark:text-zinc-900 items-center justify-center py-2 rounded-md cursor-pointer"
      onClick={() => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/wca/auth`;
      }}
    >
      <img src="WCALogo.png" alt="wca logo" height="20px" width="20px" />
      <span>Увійти через WCA ID</span>
    </div>
  );
};

export default WcaIdBtn;
