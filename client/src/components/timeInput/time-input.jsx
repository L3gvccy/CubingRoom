import { parseTimeInput } from "@/utils/tools";
import React, { useState, useEffect } from "react";

const TimeInput = ({ handleSubmit }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      chooseResult("OK");
    }
  };

  const chooseResult = (penalty) => {
    if (value === "") {
      return;
    }

    let time = parseTimeInput(value);
    let finalTime = time;

    if (penalty === "PLUS2") {
      finalTime += 2000;
    }

    if (penalty === "DNF") {
      finalTime = Number.MAX_SAFE_INTEGER;
    }

    const finalResult = { time, penalty, finalTime };
    setValue("");

    if (handleSubmit) handleSubmit(finalResult);
  };

  const handleInput = (e) => {
    const regex = /^[0-9.,:]+$/;

    if (e.target.value === "" || regex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center px-4 bg-transparent font-mono text-2xl text-center`}
    >
      <input
        value={value}
        onChange={(e) => {
          handleInput(e);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        type="text"
        placeholder="0.00"
        className="text-center p-2 outline-0 border-b-2 focus:border-violet-400 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="flex gap-2">
        <button
          className="text-[18px] py-1 px-6 rounded-md text-zinc-100 bg-orange-400 cursor-pointer"
          onClick={() => chooseResult("PLUS2")}
        >
          +2
        </button>
        <button
          className="text-[18px] py-1 px-6 rounded-md text-zinc-100 bg-red-400 cursor-pointer"
          onClick={() => chooseResult("DNF")}
        >
          DNF
        </button>
        <button
          className="text-[18px] py-1 px-6 rounded-md text-zinc-100 bg-emerald-400 cursor-pointer"
          onClick={() => chooseResult("OK")}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default TimeInput;
