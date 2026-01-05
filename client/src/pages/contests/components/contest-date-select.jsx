import { compareDate } from "@/utils/tools";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo } from "react";

const ContestDateSelect = ({ value, onChange }) => {
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(() => addDays(today, -7), []);
  const maxDate = useMemo(() => addDays(today, 1), []);

  const canGoBack = value > minDate;
  const canGoForw = !compareDate(value, maxDate);

  const handleBackBtnClick = (e) => {
    if (!canGoBack) return;

    onChange(addDays(value, -1));
  };

  const handleForwBtnClick = (e) => {
    if (!canGoForw) return;

    onChange(addDays(value, 1));
  };

  return (
    <div className="flex items-center justify-center px-4 gap-2 md:gap-5">
      <button
        disabled={!canGoBack}
        onClick={(e) => {
          handleBackBtnClick(e);
        }}
        className="text-zinc-700 hover:text-zinc-600 disabled:text-zinc-300 dark:text-zinc-300 dark:hover:text-zinc-200 dark:disabled:text-zinc-700 disabled:cursor-auto cursor-pointer transition-all duration-300"
      >
        <ChevronLeft size={30} />
      </button>

      <div className="flex flex-col gap items-center justify-center w-48">
        <p
          className={`text-lg font-semibold ${
            compareDate(value, today) && "text-violet-700 dark:text-violet-400"
          }`}
        >
          {dayjs(value).format("LL")}
        </p>
      </div>

      <button
        disabled={!canGoForw}
        onClick={(e) => {
          handleForwBtnClick(e);
        }}
        className="text-zinc-700 hover:text-zinc-600 disabled:text-zinc-300 dark:text-zinc-300 dark:hover:text-zinc-200 dark:disabled:text-zinc-700 disabled:cursor-auto cursor-pointer transition-all duration-300"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};

export default ContestDateSelect;
