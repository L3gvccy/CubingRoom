import React from "react";
import { Link, NavLink } from "react-router-dom";

const HeaderNav = () => {
  return (
    <div className="hidden md:flex gap-5 items-center">
      <NavLink
        to="/rooms"
        className={({ isActive }) =>
          `transition-all duration-300 ${
            isActive
              ? "text-green-500 font-semibold"
              : "text-zinc-200 hover:text-zinc-100 active:text-zinc-300"
          }`
        }
      >
        Кімнати
      </NavLink>
      <NavLink
        to="/contests"
        className={({ isActive }) =>
          `transition-all duration-300 ${
            isActive
              ? "text-green-500 font-semibold"
              : "text-zinc-200 hover:text-zinc-100 active:text-zinc-300"
          }`
        }
      >
        Контести
      </NavLink>
    </div>
  );
};

export default HeaderNav;
