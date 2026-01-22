import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const EventSelect = ({ value, setEvent }) => {
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
  return (
    <>
      <Select
        value={value}
        onValueChange={(e) => {
          setEvent(e);
        }}
      >
        <SelectTrigger className="w-32 cursor-pointer ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="max-w-24"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          {options.map((event, i) => (
            <SelectItem
              key={i}
              value={event[0]}
              className="hover:bg-cyan-700 cursor-pointer data-[state=checked]:bg-violet-400 dark:data-[state=checked]:bg-violet-700"
            >
              {event[1]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default EventSelect;
