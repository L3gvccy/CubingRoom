import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeDisplay, parseTimeInput } from "@/utils/tools";

const EditResult = ({ solve, onClose, onSubmit }) => {
  const [time, setTime] = useState(formatTimeDisplay(solve.time, "OK"));
  const [penalty, setPenalty] = useState(solve.penalty);

  const handleInput = (e) => {
    console.log(e);
    const regex = /^[0-9.,:]*$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setTime(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (!time) return;

    let finalTime = parseTimeInput(time);
    if (penalty === "PLUS2") {
      finalTime += 2000;
    }
    if (penalty === "DNF") {
      finalTime = Number.MAX_SAFE_INTEGER;
    }

    const finalResult = { time, penalty, finalTime };

    onSubmit({
      ...solve,
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
        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="time" className="text-zinc-300 mb-2">
              Час (без штрафів)
            </label>
            <input
              type="text"
              placeholder="0.00"
              value={time}
              onChange={handleInput}
              className="p-2 rounded-lg bg-zinc-800 outline-none"
              autoFocus
            />
          </div>
          <div className="flex gap-2 flex-col">
            <p className="text-zinc-300">Штраф:</p>
            <div className="flex gap-2 items-center">
              {["OK", "PLUS2", "DNF"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPenalty(p)}
                  className={`px-3 py-1 rounded ${
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
            {formatTimeDisplay(parseTimeInput(time), penalty)}
          </div>

          <button
            disabled={!time}
            className="text-lg items-center bg-violet-700 hover:bg-violet-600 disabled:bg-violet-950 disabled:text-zinc-300 px-4 py-2 rounded-lg cursor-pointer disabled:cursor-auto transition-all duration-300"
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
