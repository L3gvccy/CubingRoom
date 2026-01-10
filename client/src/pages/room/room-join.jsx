import { apiClient } from "@/lib/api-client";
import { JOIN_ROOM } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const RoomJoin = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [password, setPassword] = useState("");

  const joinRoom = async () => {
    await apiClient
      .post(
        JOIN_ROOM,
        { roomId: parseInt(roomId), password },
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.ok) {
          if (password !== "") {
            toast.error("Невірний пароль");
          }
        } else {
          navigate(`/rooms/${roomId}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBtnClick = async () => {
    await joinRoom();
  };

  useEffect(() => {
    joinRoom();
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col w-[90vw] max-w-102 gap-5 p-4 bg-zinc-900 border border-zinc-800 shadow-xl rounded-lg">
        <p className="text-lg font-semibold">Вхід в кімнату</p>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-zinc-300 ">
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
    </div>
  );
};

export default RoomJoin;
