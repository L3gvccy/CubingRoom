import { useAppStore } from "@/store";
import React from "react";
import HeaderLogo from "./components/header-logo";
import HeaderNav from "./components/header-nav";
import EndMenu from "./components/end-menu";

const Header = () => {
  const { userData } = useAppStore();
  const authorized = !!userData;
  return (
    <div className="flex justify-center items-center w-screen p-2 bg-zinc-900 border-zinc-800/50 border-b-2">
      <div className="flex items-center justify-between w-full max-w-342">
        <HeaderLogo />
        <HeaderNav />
        <EndMenu />
      </div>
    </div>
  );
};

export default Header;
