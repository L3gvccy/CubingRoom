import { Lock, LockOpen, User } from "lucide-react";
import React from "react";

const RoomLink = ({ room }) => {
  return (
    <div
      className="rounded-lg bg-zinc-800 hover:bg-zinc-700 flex p-4 gap-4 cursor-pointer transition-all duration-300"
      onClick={() => {
        console.log(room);
      }}
    >
      <img
        src={`/event-icons/${room.event}.svg`}
        alt={room.event}
        className="w-16"
      />
      <div className="flex flex-col justify-between">
        <div className="flex gap-5 items-center">
          <p className="text-xl font-semibold">{room.name}</p>
        </div>

        <div className="flex gap-5 items-center">
          <p>{room.event}</p>
          <div className="flex gap-2 items-center">
            <User size={18} />
            <span>{room.users.filter((u) => u.status !== "LEFT").length}</span>
          </div>
          {room.private ? <Lock size={18} /> : <LockOpen size={18} />}
        </div>
      </div>
    </div>
  );
};

export default RoomLink;
