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
import React, { useState } from "react";
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
import { Link, NavLink, useNavigate } from "react-router-dom";

const EndMenu = ({ authorized }) => {
  const { userData, setUserData } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await apiClient
      .get(LOGOUT_ROUTE, { withCredentials: true })
      .then((res) => {
        setUserData(undefined);
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex gap-3">
      {authorized ? (
        <>
          <DropdownMenu
            open={open}
            onOpenChange={() => {
              setOpen(!open);
              if (document.activeElement instanceof HTMLElement) {
                requestAnimationFrame(() => {
                  document.activeElement?.blur();
                });
              }
            }}
          >
            <DropdownMenuTrigger className="cursor-pointer outline-0">
              <UserAvatar size="md" image={userData.image} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[90vw] max-w-56"
              align="end"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
            >
              <DropdownMenuLabel className="truncate">
                {userData.displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/users/${userData.id}`);
                }}
              >
                Профіль
              </DropdownMenuItem>
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
          className="border-zinc-100 text-zinc-100 border  hover:bg-zinc-100 hover:text-zinc-900 rounded-lg text-md flex px-4 py-1 gap-2 items-center transition-all duration-300 cursor-pointer"
        >
          <span>Авторизація</span>
          <IoLogInOutline />
        </Link>
      )}
    </div>
  );
};

export default EndMenu;
