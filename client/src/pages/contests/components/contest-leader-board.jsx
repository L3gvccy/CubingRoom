import { useAppStore } from "@/store";
import { formatTimeDisplay, getNameAndFormat } from "@/utils/tools";
import { Trophy } from "lucide-react";
import React from "react";

const ContestLeaderBoard = ({ results, event }) => {
  const { userData } = useAppStore();
  const [name, format] = getNameAndFormat(event);

  const displaySolves = (solves) => {
    console.log(solves);
    const solvesToDisplay = [];

    solves.forEach((solve) => {
      const timeToDisplay =
        solve.finalTime === Number.MAX_SAFE_INTEGER
          ? "DNF"
          : formatTimeDisplay(solve.finalTime);
      solvesToDisplay.push(timeToDisplay);
    });

    // If format is ao5 take worst and best in brackets
    // Output: 1.32, 1.45, (1.28), (1.50), 1.40
    if (format.startsWith("ao")) {
      const length = parseInt(format.slice(2));
      if (solves.length === length) {
        const times = solves.map((s) => s.finalTime);
        const validTimes = times.filter((t) => t !== Number.MAX_SAFE_INTEGER);
        const bestTime = Math.min(...validTimes);
        const worstTime = Math.max(...validTimes);
        const newSolvesToDisplay = solvesToDisplay.map((s, index) => {
          const solve = solves[index];
          const solveFinalTime = solve.finalTime;
          if (solveFinalTime === bestTime || solveFinalTime === worstTime) {
            return `(${formatTimeDisplay(solve.time, solves.penalty)})`;
          }
          return formatTimeDisplay(solve.time, solves.penalty);
        });
        console.log(newSolvesToDisplay);
        return newSolvesToDisplay.join(", ");
      }
    }

    return solvesToDisplay.join(", ");
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 text-center text-lg font-semibold  p-4">
        <Trophy />
        <span>Таблиця лідерів</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 min-w-12">#</th>
              <th className="p-2 min-w-48 md:min-w-60">Ім'я</th>
              <th className="p-2">Single</th>
              <th className="p-2">{format}</th>
              <th className="p-2">Збірки</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className={`border-b ${userData?.id === result.user.id ? "bg-white/10" : ""} `}
              >
                <td className="p-2 min-w-12 text-center">
                  {index + 1}
                  {index === 0 && <span>🥇</span>}
                  {index === 1 && <span>🥈</span>}
                  {index === 2 && <span>🥉</span>}
                </td>
                <td className="p-2 min-w-48 md:min-w-60 flex justify-center">
                  <a href={`/users/${result.user.id}`} target="_blank">
                    {result.user.displayName}
                  </a>
                </td>
                <td className="p-2  text-center">
                  {formatTimeDisplay(result.best)}
                </td>
                <td className="p-2  text-center">
                  {result.average ? formatTimeDisplay(result.average) : "DNF"}
                </td>
                <td className="p-2 flex justify-center whitespace-nowrap">
                  {displaySolves(result.results)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContestLeaderBoard;
