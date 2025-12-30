import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user-avatar";
import { useAppStore } from "@/store";
import React from "react";
import { useTheme } from "@/context/themeContext";
import {
  IoLogOutOutline,
  IoLogInOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoReorderThree,
} from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { Link, NavLink } from "react-router-dom";

const EndMenu = ({ authorized }) => {
  const { userData, setUserData } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  const logout = async () => {
    apiClient
      .get(LOGOUT_ROUTE, { withCredentials: true })
      .then((res) => {
        setUserData(undefined);
        toast.success(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex gap-3">
      {authorized ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-0">
              <UserAvatar size={8} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[90vw] max-w-56" align="end">
              <DropdownMenuLabel className="truncate">
                {userData.displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Профіль</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                <div className="flex gap-2 items-center">
                  <span>Змінити тему</span>
                  <span className="text-md">
                    {theme === "dark" ? <IoSunnyOutline /> : <IoMoonOutline />}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <div className="flex gap-2 items-center">
                  <span>Вийти</span>
                  <IoLogOutOutline />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Link
          to="/auth"
          className="border-zinc-100 text-zinc-100 border hover:border-green-500 hover:bg-green-500 rounded-lg text-md flex px-4 py-1 gap-2 items-center transition-all duration-300 cursor-pointer"
        >
          <span>Авторизація</span>
          <IoLogInOutline />
        </Link>
      )}
    </div>
  );
};

export default EndMenu;
