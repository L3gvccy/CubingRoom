import React, { useMemo } from "react";
import { formatTimeDisplay } from "@/utils/tools";
import "./table.css";

const ResultsTable = ({ users = [], solves = [], currentSolve }) => {
  /**
   * Активні користувачі
   * Порядок фіксований
   */
  const activeUsers = useMemo(() => {
    return [...users]
      .filter((u) => u.status !== "LEFT")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [users]);

  /**
   * Переможець КОЖНОЇ збірки
   * solveId -> userId
   */
  const winnersBySolveId = useMemo(() => {
    const map = {};

    solves.forEach((solve) => {
      const valid = solve.results?.filter((r) => r.result.penalty !== "DNF");
      if (!valid || valid.length === 0) return;

      const winner = valid.reduce((best, cur) =>
        cur.result.finalTime < best.result.finalTime ? cur : best
      );

      map[solve.id] = winner.userId;
    });

    return map;
  }, [solves]);

  /**
   * Кількість перемог
   */
  const winsByUserId = useMemo(() => {
    const wins = {};
    activeUsers.forEach((u) => (wins[u.id] = 0));

    Object.values(winnersBySolveId).forEach((userId) => {
      if (wins[userId] !== undefined) {
        wins[userId]++;
      }
    });

    return wins;
  }, [activeUsers, winnersBySolveId]);

  return (
    <div
      className="results-table-container h-full w-full overflow-auto relative
      scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
    >
      <table className="border-collapse min-w-max text-sm">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 bg-zinc-900 border px-2 py-1 z-40"></th>

            {activeUsers.map((user) => (
              <th
                key={user.userId}
                className="sticky top-0 bg-zinc-900 border px-3 py-1 z-30 text-center"
              >
                {user.user?.displayName || "?"}
              </th>
            ))}
          </tr>

          <tr>
            <th className="sticky top-8 left-0 bg-zinc-900 border px-2 py-1 z-40 text-xs">
              🏆
            </th>

            {activeUsers.map((user) => (
              <th
                key={user.userId}
                className="sticky top-8 bg-zinc-900 border px-3 py-1 z-30 text-xs text-emerald-400"
              >
                {winsByUserId[user.id] || 0}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {solves.map((solve) => {
            const winnerUserId = winnersBySolveId[solve.id];
            const isCurrent = currentSolve?.id === solve.id;

            return (
              <tr key={solve.id}>
                <td
                  className={`sticky left-0 bg-zinc-900 border px-2 py-1 z-20 text-center font-bold
                    ${isCurrent ? "bg-zinc-800" : ""}`}
                >
                  {solve.index}
                </td>

                {activeUsers.map((user) => {
                  const userResult = solve.results?.find(
                    (r) => r.userId === user.id
                  );

                  const display = userResult
                    ? formatTimeDisplay(
                        userResult.result.time,
                        userResult.result.penalty
                      )
                    : "—";

                  const isWinner = user.id === winnerUserId;

                  return (
                    <td
                      key={user.userId}
                      className={`border px-2 py-1 text-center whitespace-nowrap
                        ${isCurrent ? "bg-zinc-700" : ""}
                        ${isWinner ? "text-emerald-400 font-semibold" : ""}`}
                    >
                      {display}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
