import React, { useMemo, useState } from "react";
import { formatTimeDisplay } from "@/utils/tools";
import "./table.css";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store";
import EditResult from "@/components/edit-result";

const ResultsTable = ({
  users = [],
  solves = [],
  currentSolve,
  onSolveEdit,
  event,
}) => {
  const { userData } = useAppStore();
  const [solveToEdit, setSolveToEdit] = useState(null);
  const [selectedScramble, setSelectedScramble] = useState(null);
  const activeUsers = useMemo(() => {
    return [...users]
      .filter((u) => u.status !== "LEFT")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [users]);

  const winnersBySolveId = useMemo(() => {
    const map = {};

    solves.forEach((solve) => {
      const valid = solve.results?.filter((r) => r.result.penalty !== "DNF");
      if (!valid || valid.length === 0) return;

      const winner = valid.reduce((best, cur) =>
        cur.result.finalTime < best.result.finalTime ? cur : best,
      );

      map[solve.id] = winner.userId;
    });

    return map;
  }, [solves]);

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
      <table className="border-collapse min-w-max w-full text-sm">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 bg-zinc-900 border px-2 py-1 z-40 w-12"></th>

            {activeUsers.map((user) => (
              <th
                key={user.userId}
                className="sticky top-0 bg-zinc-900 border px-3 py-1 z-30 text-center"
              >
                <a
                  className="cursor-pointer"
                  href={`/users/${user.user.id}`}
                  target="_blank"
                >
                  {user.user?.displayName || "?"}
                </a>
              </th>
            ))}
          </tr>

          <tr>
            <th className="sticky top-8 left-0 bg-zinc-900 border px-2 py-1 z-40 text-xs w-12">
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
                  className={`sticky left-0 bg-zinc-900 border px-2 py-1 z-20 text-center font-bold w-12
                    ${isCurrent ? "bg-zinc-800" : ""}`}
                >
                  {solve.index}
                </td>

                {activeUsers.map((user) => {
                  const userResult = solve.results?.find(
                    (r) => r.userId === user.id,
                  );

                  const display = userResult ? (
                    user.userId === userData.id ? (
                      <span
                        className="px-2 cursor-pointer hover:bg-zinc-100/10 rounded-md transition-all duration-300"
                        onClick={() => {
                          setSolveToEdit(userResult.result);
                          setSelectedScramble(solve.scramble);
                        }}
                      >
                        {formatTimeDisplay(
                          userResult.result.time,
                          userResult.result.penalty,
                        )}
                      </span>
                    ) : (
                      formatTimeDisplay(
                        userResult.result.time,
                        userResult.result.penalty,
                      )
                    )
                  ) : (
                    "—"
                  );

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

      {solveToEdit !== null && (
        <EditResult
          solve={solveToEdit}
          onClose={() => setSolveToEdit(null)}
          onSubmit={onSolveEdit}
          scramble={selectedScramble}
          event={event}
        />
      )}
    </div>
  );
};

export default ResultsTable;
