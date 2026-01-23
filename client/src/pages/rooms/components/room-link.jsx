import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { JOIN_ROOM } from "@/utils/constants";
import { getNameAndFormat } from "@/utils/tools";
import { Lock, LockOpen, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RoomLink = ({ room }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleClick = async () => {
    await apiClient
      .post(JOIN_ROOM, { roomId: room.id }, { withCredentials: true })
      .then((res) => {
        if (!res.data.ok) {
          setModalOpen(true);
        } else {
          navigate(`/rooms/${room.id}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBtnClick = async () => {
    await apiClient
      .post(
        JOIN_ROOM,
        { roomId: room.id, password: password },
        { withCredentials: true },
      )
      .then((res) => {
        if (!res.data.ok) {
          toast.error("Невірний пароль");
        } else {
          navigate(`/rooms/${room.id}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-124">
          <DialogHeader>
            <DialogTitle>
              Вхід в кімнату <span className="font-semibold">{room.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-zinc-300 mb-2">
                Пароль
              </label>
              <input
                placeholder="Введіть пароль"
                name="password"
                type="text"
                className="p-2 rounded-lg bg-zinc-800 outline-0"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              disabled={!password}
              className="text-lg items-center bg-violet-700 hover:bg-violet-600 disabled:bg-violet-950 disabled:text-zinc-300 px-4 py-2 rounded-lg cursor-pointer disabled:cursor-auto transition-all duration-300"
              onClick={handleBtnClick}
            >
              Увійти
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div
        className="rounded-lg bg-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex p-4 gap-4 cursor-pointer transition-all duration-300"
        onClick={() => {
          handleClick();
        }}
      >
        <img
          src={`/event-icons/${room.event}.svg`}
          alt={room.event}
          className="w-16 invert-100 dark:invert-0"
        />
        <div className="flex flex-col justify-between">
          <div className="flex gap-5 items-center">
            <p className="text-xl font-semibold">{room.name}</p>
          </div>

          <div className="flex gap-5 items-center">
            <p>{getNameAndFormat(room.event)[0]}</p>
            <div className="flex gap-2 items-center">
              <User size={18} />
              <span>
                {room.users.filter((u) => u.status !== "LEFT").length}
              </span>
            </div>
            {room.private ? <Lock size={18} /> : <LockOpen size={18} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomLink;
