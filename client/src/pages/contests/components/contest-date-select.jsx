import { compareDate } from "@/utils/tools";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const ContestDateSelect = ({
  contests,
  selectedContest,
  setSelectedContest,
}) => {
  const canGoBack = selectedContest.id !== contests[0].id;
  const canGoForw = selectedContest.id !== contests[contests.length - 1].id;

  const handleBackBtnClick = (e) => {
    e.preventDefault();
    if (!canGoBack) return;
    const currentIndex = contests.findIndex(
      (contest) => contest.id === selectedContest.id
    );
    setSelectedContest(contests[currentIndex - 1]);
  };
  const handleForwBtnClick = (e) => {
    e.preventDefault();
    if (!canGoForw) return;
    const currentIndex = contests.findIndex(
      (contest) => contest.id === selectedContest.id
    );
    setSelectedContest(contests[currentIndex + 1]);
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

      <div className="flex flex-col md:flex-row md:gap-2 gap items-center justify-center w-48 md:w-102">
        <p
          className={`text-lg font-semibold ${
            selectedContest.isActive && "text-violet-700 dark:text-violet-400"
          }`}
        >
          {dayjs(selectedContest.startDate).format("LL")}
        </p>
        <p
          className={`text-lg font-semibold ${
            selectedContest.isActive && "text-violet-700 dark:text-violet-400"
          }`}
        >
          {" - "}
        </p>
        <p
          className={`text-lg font-semibold ${
            selectedContest.isActive && "text-violet-700 dark:text-violet-400"
          }`}
        >
          {dayjs(selectedContest.endDate).format("LL")}
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
