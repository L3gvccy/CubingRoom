import React, { useEffect, useState } from "react";
import CreateRoom from "./components/create-room";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { RotateCcw } from "lucide-react";
import { GET_ALL_ROOMS } from "@/utils/constants";
import Loader from "@/components/loader/loader";
import RoomLink from "./components/room-link";

const Rooms = () => {
  const { userData } = useAppStore();
  const [allRooms, setAllRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [privateRooms, setPrivateRooms] = useState([]);
  const [publicRooms, setPublicRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const getRooms = async () => {
    setLoading(true);
    await apiClient
      .get(GET_ALL_ROOMS, { withCredentials: true })
      .then((res) => {
        setAllRooms(res.data.rooms);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status !== 500) {
          toast.error(err.response?.data?.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    const my = [];
    const priv = [];
    const pub = [];
    allRooms.forEach((room) => {
      if (room.ownerId === userData.id) {
        my.push(room);
      } else if (room.private) {
        priv.push(room);
      } else {
        pub.push(room);
      }
    });
    setMyRooms(my);
    setPrivateRooms(priv);
    setPublicRooms(pub);
  }, [allRooms]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full py-4 justify-center">
      <div className="flex flex-col w-full max-w-342 gap-5 px-4">
        <p className="text-2xl font-bold text-center">Кімнати</p>
        <div className="flex w-full justify-between ">
          <CreateRoom onRoomCreate={getRooms} />
          <button
            className="rounded-lg flex items-center gap-2 px-4 py-2 text-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-all duration-300"
            onClick={getRooms}
          >
            <span className="hidden sm:inline">Оновити список</span>
            <RotateCcw size={22} />
          </button>
        </div>
        <p className="text-xl py-2 border-b-2 border-zinc-700">Мої кімнати</p>
        {myRooms.length > 0 ? (
          myRooms.map((r) => <RoomLink room={r} key={r.id} />)
        ) : (
          <p>Власних кімнат не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
