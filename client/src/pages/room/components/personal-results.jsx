import {
  calculateAverage,
  formatTimeDisplay,
  getNameAndFormat,
} from "@/utils/tools";
import React, { useEffect, useState } from "react";
import "./table.css";

const PersonalResults = ({ solves, event, userId }) => {
  const [name, format] = getNameAndFormat(event);
  const [stats, setStats] = useState({
    single: null,
    stats: {},
  });

  const mySolves = solves
    .map((solve) => {
      const myResult = solve.results.find((r) => r.userId === userId);
      if (!myResult) return null;

      return {
        index: solve.index,
        scramble: solve.scramble,
        time: myResult.result.time,
        penalty: myResult.result.penalty,
        finalTime: myResult.result.finalTime,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);

  const computeStats = (userSolves) => {
    if (!userSolves || !userSolves.length) return {};

    const stats = {};

    // single
    const single = {
      current: userSolves[userSolves.length - 1],
      best: userSolves.reduce((best, s) => {
        if (!best) return s;
        return (s.finalTime ?? Number.MAX_SAFE_INTEGER) <
          (best.finalTime ?? Number.MAX_SAFE_INTEGER)
          ? s
          : best;
      }, null),
    };

    // інші середні
    ["mo3", "ao5", "ao12", "ao50", "ao100"].forEach((stat) => {
      const length = parseInt(stat.slice(2));
      const solvesCopy = userSolves.map((s) => ({ ...s })); // копія для сортування

      let current = undefined;
      if (solvesCopy.length >= length) {
        const lastSolves = solvesCopy.slice(-length);
        current = calculateAverage([...lastSolves], length);
      }

      // best average
      let best = undefined;
      for (let i = 0; i <= solvesCopy.length - length; i++) {
        const segment = solvesCopy.slice(i, i + length);
        const avg = calculateAverage([...segment], length);
        if (avg !== undefined && (best === undefined || avg < best)) best = avg;
      }

      stats[stat] = { current, best };
    });

    return { stats, single };
  };

  useEffect(() => {
    if (solves.length > 0) {
      const res = computeStats(mySolves);
      setStats(res);
    }
  }, [solves]);

  if (stats && solves.length > 0)
    return (
      <table className="table border-spacing-2 table-auto personal-table">
        <thead>
          <tr>
            <td></td>
            <td className="font-semibold">Поточний</td>
            <td className="font-semibold">Кращий</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-semibold">Single</td>
            {stats.single ? (
              <>
                <td className="text-center">
                  {formatTimeDisplay(
                    stats.single?.current.time,
                    stats.single?.current.penalty,
                  )}
                </td>
                <td className="text-center">
                  {formatTimeDisplay(
                    stats.single?.best.time,
                    stats.single?.best.penalty,
                  )}
                </td>
              </>
            ) : (
              <>
                <td className="text-center">–</td>
                <td className="text-center">–</td>
              </>
            )}
          </tr>

          {stats?.stats &&
            Object.entries(stats.stats).map(([key, val]) => {
              if (mySolves.length < parseInt(key.slice(2))) return null;
              return (
                <tr key={key}>
                  <td className="font-semibold">{key.toUpperCase()}</td>
                  <td className="text-center">
                    {val.current ? formatTimeDisplay(val.current, "OK") : "DNF"}
                  </td>
                  <td className="text-center">
                    {val.best ? formatTimeDisplay(val.best, "OK") : "DNF"}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
};

export default PersonalResults;
