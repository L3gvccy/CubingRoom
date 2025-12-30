import { useAppStore } from "@/store";
import React from "react";
import HeaderLogo from "./components/header-logo";
import HeaderNav from "./components/header-nav";
import EndMenu from "./components/end-menu";

const Header = () => {
  const { userData } = useAppStore();
  const authorized = !!userData;
  return (
    <div className="flex justify-center items-center w-full p-2 bg-zinc-900 border-zinc-800/50 border-b-2">
      <div className="flex items-center justify-between w-full max-w-342">
        <div className="flex flex-row-reverse md:flex-row gap-3 md:gap-12">
          <HeaderLogo />
          <HeaderNav authorized={authorized} />
        </div>

        <EndMenu authorized={authorized} />
      </div>
    </div>
  );
};

export default Header;
