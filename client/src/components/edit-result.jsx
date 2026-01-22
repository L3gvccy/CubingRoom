import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeDisplay, parseTimeInput } from "@/utils/tools";
import ShowScramble from "./show-scramble";

const EditResult = ({ solve, onClose, onSubmit, scramble = null, event }) => {
  const [rawTime, setRawTime] = useState(formatTimeDisplay(solve.time, "OK"));
  const [penalty, setPenalty] = useState(solve.penalty);

  const handleInput = (e) => {
    console.log(e);
    const regex = /^[0-9.,:]*$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setRawTime(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (!rawTime) return;

    let time = parseTimeInput(rawTime);

    let finalTime = time;
    if (penalty === "PLUS2") {
      finalTime += 2000;
    }
    if (penalty === "DNF") {
      finalTime = Number.MAX_SAFE_INTEGER;
    }

    const finalResult = { time, penalty, finalTime };

    onSubmit({
      solveId: solve.id,
      finalResult,
    });

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Редагувати результат</DialogTitle>
        </DialogHeader>

        {scramble && event === "megaminx" ? (
          <div className="flex justify-center">
            <pre className="text-[14px] text-start w-fit opacity-90">
              {scramble}
            </pre>
          </div>
        ) : (
          <div className="text-[14px] text-center px-4 opacity-90">
            {scramble}
          </div>
        )}

        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="time"
              className="text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Час (без штрафів)
            </label>
            <input
              type="text"
              placeholder="0.00"
              value={rawTime}
              onChange={handleInput}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 outline-none"
              autoFocus
            />
          </div>
          <div className="flex gap-2 flex-col">
            <p className="text-zinc-700 dark:text-zinc-300">Штраф:</p>
            <div className="flex gap-2 items-center">
              {["OK", "PLUS2", "DNF"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPenalty(p)}
                  className={`px-3 py-1 cursor-pointer rounded ${
                    penalty === p
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <strong>Фінальний час: </strong>
            {formatTimeDisplay(parseTimeInput(rawTime), penalty)}
          </div>

          <button
            disabled={!rawTime}
            className="text-lg items-center text-zinc-100 bg-violet-700 hover:bg-violet-600 disabled:bg-violet-950 disabled:text-zinc-300 px-4 py-2 rounded-lg cursor-pointer disabled:cursor-auto transition-all duration-300"
            onClick={handleSubmit}
          >
            Змінити результат
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditResult;
