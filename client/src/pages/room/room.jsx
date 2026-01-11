import EventSelect from "@/components/event-select";
import GlobalTimer from "@/components/global-timer";
import Loader from "@/components/loader/loader";
import ShowScramble from "@/components/show-scramble";
import TimerTypeSelect from "@/components/timer-type-select";
import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ROOM_BY_ID } from "@/utils/constants";
import { getDisplay, getNameAndFormat } from "@/utils/tools";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ResultsTable from "./components/results-table";
import PersonalResults from "./components/personal-results";

const Room = () => {
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const navigate = useNavigate();
  const joinedRef = useRef(false);
  const { roomId: roomIdStr } = useParams();
  const roomId = Number(roomIdStr);
  const { userData } = useAppStore();
  const [roomUser, setRoomUser] = useState(null);
  const [room, setRoom] = useState({});
  const [solves, setSolves] = useState(null);
  const [currentSolve, setCurrentSolve] = useState();

  const newScrBtnRef = useRef();

  const isAdmin = roomUser?.role === "ADMIN";

  const getRoom = async () => {
    await apiClient
      .get(GET_ROOM_BY_ID(roomId), { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (!res.data.room.users.some((u) => u.userId === userData.id)) {
          navigate(`/join-room/${roomId}`);
          return;
        }
        setRoom(res.data.room);
        setSolves(res.data.solves);
        setRoomUser(res.data.room.users.find((u) => u.userId === userData.id));
      })
      .catch((err) => {
        toast.error("Кімната не знайдена");
        navigate("/rooms");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (res) => {
    console.log(res);
    socket.emit("room:submit", { roomId, finalResult: res });
  };

  const newScramble = () => {
    newScrBtnRef.current.blur();
    socket.emit("room:update-scramble", { roomId });
  };

  const changeEvent = (event) => {
    if (
      window.confirm(
        `Ви дійсно хочете змінити дисципліну на "${event}"?\nВсі результати буде видалено`
      )
    ) {
      socket.emit("room:update-event", { roomId, event });
    }
  };

  useEffect(() => {
    if (!socket || joinedRef.current) return;

    socket.emit("room:join", { roomId });
    joinedRef.current = true;

    const onState = (state) => {
      console.log("room:state", state);
      setRoom(state.room);
      setSolves(state.solves);

      const ru = state.room.users.find((u) => u.userId === userData.id);
      console.log(ru);
      setRoomUser(ru);
    };

    socket.on("room:state", onState);

    return () => {
      socket.emit("room:leave", { roomId });
      socket.off("room:state", onState);
    };
  }, [socket, roomId, userData.id]);

  useEffect(() => {
    getRoom();
  }, []);

  useEffect(() => {
    if (solves) {
      setCurrentSolve(solves[0]);
    }
  }, [solves]);

  if (loading)
    return (
      <div className="flex flex-col w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col max-w-342 w-full px-4">
        <div className="flex flex-col md:flex-row w-full py-2 gap-2 items-center justify-between">
          {isAdmin ? (
            <EventSelect
              value={room.event}
              setEvent={(e) => {
                changeEvent(e);
              }}
            />
          ) : (
            <div className="py-1 px-8 border border-zinc-700 rounded-md">
              {getNameAndFormat(room.event)[0]}
            </div>
          )}
          <span className="text-xl font-semibold max-w-56 truncate">
            {room.name}
          </span>
          <TimerTypeSelect />
        </div>
        {isAdmin && (
          <div className="flex py-2 justify-center">
            <button
              ref={newScrBtnRef}
              className="px-4 py-1 flex gap-2 items-center rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-all duration-300"
              onClick={newScramble}
            >
              <RotateCcw size={18} />
              <span>Новий скрамбл</span>
            </button>
          </div>
        )}

        <div className="py-4">
          <ShowScramble event={room.event} scramble={currentSolve?.scramble} />
        </div>
        <div className="flex justify-center items-center py-2 h-22.5">
          {roomUser.status === "WAITING" ? (
            <p className="font-mono text-lg text-zinc-100/75">
              Очікування інших учасників
            </p>
          ) : (
            <GlobalTimer handleSubmit={handleSubmit} />
          )}
        </div>
        <div
          className="h-[40vh] my-2 flex items-center justify-center scrollbar-thin"
          key={room?.updatedAt || room?.id}
        >
          <ResultsTable
            users={room.users}
            solves={solves}
            currentSolve={currentSolve}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-center">
          <div className="flex-1 h-full p-4">
            {solves.length > 0 && (
              <PersonalResults
                solves={solves}
                event={room.event}
                userId={roomUser.id}
              />
            )}
          </div>
          <scramble-display
            event={getDisplay(room.event)}
            scramble={currentSolve?.scramble}
            className="max-w-86"
          ></scramble-display>
        </div>
      </div>
    </div>
  );
};

export default Room;
