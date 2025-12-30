import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { IoReorderThree } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

const HeaderNav = ({ authorized }) => {
  return (
    <>
      <div
        className={`hidden md:flex ${
          !authorized && "md:hidden"
        } gap-5 items-center`}
      >
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
      {authorized && (
        <DropdownMenu className="md:hidden">
          <DropdownMenuTrigger className="md:hidden cursor-pointer outline-0">
            <div className="w-8 h-8 flex items-center justify-center text-2xl rounded-md text-zinc-400 border-2 border-zinc-400">
              <IoReorderThree />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[90vw] max-w-56" align="start">
            <DropdownMenuItem asChild>
              <NavLink
                to="/rooms"
                end
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
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink
                to="/contests"
                end
                className={({ isActive }) => {
                  console.log(isActive);
                  return `transition-all duration-300 ${
                    isActive
                      ? "text-green-500 font-semibold"
                      : "text-zinc-200 hover:text-zinc-100 active:text-zinc-300"
                  }`;
                }}
              >
                Контести
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default HeaderNav;
