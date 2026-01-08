import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPDATE_TIMER_TYPE } from "@/utils/constants";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TimerTypeSelect = () => {
  const { userData, setUserData } = useAppStore();
  const options = [
    ["KEYBOARD", "Таймер"],
    ["TYPING", "Введення"],
  ];

  const updateTimerType = async (type) => {
    const currUserData = userData;
    setUserData({ ...userData, timerType: type });
    await apiClient
      .patch(UPDATE_TIMER_TYPE, { timerType: type }, { withCredentials: true })
      .catch((err) => {
        console.error(err);
        setUserData(currUserData);
      });
  };

  return (
    <Select
      value={userData?.timerType}
      onValueChange={(e) => {
        updateTimerType(e);
      }}
    >
      <SelectTrigger className="max-w-32 cursor-pointer ">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="max-w-24"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {options.map((option, i) => (
          <SelectItem
            key={i}
            value={option[0]}
            className="hover:bg-cyan-700 cursor-pointer data-[state=checked]:bg-violet-700"
          >
            {option[1]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimerTypeSelect;
