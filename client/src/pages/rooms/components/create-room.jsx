import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";
import { CREATE_ROOM } from "@/utils/constants";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const CreateRoom = ({ onRoomCreate }) => {
  const [open, setOpen] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [event, setEvent] = useState("333");

  const [canCreate, setCanCreate] = useState(false);

  const options = [
    ["333", "3x3"],
    ["222", "2x2"],
    ["444", "4x4"],
    ["555", "5x5"],
    ["666", "6x6"],
    ["777", "7x7"],
    ["333oh", "3x3 OH"],
    ["megaminx", "Megaminx"],
    ["pyraminx", "Pyraminx"],
    ["clock", "Clock"],
    ["skewb", "Skewb"],
    ["sq1", "Square-1"],
  ];

  useEffect(() => {
    if (roomName && ((password && passwordRequired) || !passwordRequired)) {
      setCanCreate(true);
    } else {
      setCanCreate(false);
    }
  }, [roomName, password, passwordRequired]);

  const createRoom = async () => {
    await apiClient
      .post(
        CREATE_ROOM,
        {
          name: roomName,
          event: event,
          isPrivate: passwordRequired,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Кімната успішно створена");
        setOpen(false);
        setPasswordRequired(false);
        setRoomName("");
        setPassword("");
        setCanCreate(false);
        onRoomCreate();
      })
      .catch((err) => {
        if (err.response.status !== 500) {
          toast.error(err.response?.data?.message);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <>
      <button
        className="flex gap-2 text-lg items-center bg-violet-700 hover:bg-violet-600 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Plus /> <span className="hidden sm:inline">Створити кімнату</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-156">
          <DialogHeader>
            <DialogTitle>Створити кімнату</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col mt-4 gap-5">
            <div className="flex flex-col">
              <label htmlFor="roomName" className="text-zinc-300 mb-2">
                Назва кімнати
              </label>
              <input
                placeholder="Введіть назву"
                name="roomName"
                type="text"
                className="p-2 rounded-lg bg-zinc-800 outline-0"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Switch
                checked={passwordRequired}
                onCheckedChange={setPasswordRequired}
              />
              <span>Приватна кімната</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="roomPassword" className="text-zinc-300 mb-2">
                Пароль
              </label>
              <input
                readOnly={!passwordRequired}
                placeholder="Введіть пароль"
                name="roomPassword"
                type="text"
                className="p-2 rounded-lg bg-zinc-800 outline-0 read-only:text-zinc-600 read-only:placeholder:text-zinc-700 read-only:bg-zinc-900"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <Select
                value={event}
                onValueChange={(e) => {
                  setEvent(e);
                }}
              >
                <SelectTrigger className="w-full cursor-pointer bg-zinc-800 p-2 text-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="w-full"
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                >
                  {options.map((event, i) => (
                    <SelectItem
                      key={i}
                      value={event[0]}
                      className="hover:bg-cyan-700 cursor-pointer data-[state=checked]:bg-violet-700"
                    >
                      {event[1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              disabled={!canCreate}
              className="text-lg items-center bg-violet-700 hover:bg-violet-600 disabled:bg-violet-950 disabled:text-zinc-300 px-4 py-2 rounded-lg cursor-pointer disabled:cursor-auto transition-all duration-300"
              onClick={createRoom}
            >
              Створити кімнату
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRoom;
