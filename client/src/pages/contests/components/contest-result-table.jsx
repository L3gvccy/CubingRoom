import React, { useEffect, useState } from "react";
import { formatTimeDisplay, getNameAndFormat } from "@/utils/tools";
import EditResult from "@/components/edit-result";
import { apiClient } from "@/lib/api-client";
import { EDIT_CONTEST_TIME } from "@/utils/constants";
import { toast } from "sonner";

const ContestResultTable = ({ event, solves, setSolves, editable }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [bestIndex, setBestIndex] = useState(null);
  const [worstIndex, setWorstIndex] = useState();

  const calculateBestAndWorst = () => {
    let best = Number.MAX_SAFE_INTEGER;
    let worst = -1;
    let bestIdx = null;
    let worstIdx = null;
    if (solves.length === 0) return;

    const format = getNameAndFormat(event)[1];
    if (format === "mo3") return;

    if (solves.length === 1) {
      setBestIndex(0);
      setWorstIndex(null);
      return;
    }

    solves.forEach((solve, index) => {
      if (solve.finalTime < best) {
        best = solve.finalTime;
        bestIdx = index;
      }
      if (solve.finalTime > worst) {
        worst = solve.finalTime;
        worstIdx = index;
      }
    });

    setBestIndex(bestIdx);
    setWorstIndex(worstIdx);
  };

  const editTime = async (data) => {
    await apiClient
      .post(EDIT_CONTEST_TIME(data.solveId), data.finalResult, {
        withCredentials: true,
      })
      .then((res) => {
        setSolves(res.data.solves);
        toast.success("Результат успішно оновлено");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Помилка при оновленні результату");
      });
  };

  useEffect(() => {
    calculateBestAndWorst();
  }, [solves]);

  return (
    <>
      <table className="table w-full max-w-64 text-center">
        <thead>
          <tr>
            <td className="border font-semibold w-12">#</td>
            <td className="border font-semibold">Час</td>
          </tr>
        </thead>
        <tbody>
          {Array.from(
            {
              length: Number(getNameAndFormat(event)[1].slice(2)),
            },
            (_, i) => (
              <tr key={i}>
                <td className="border">{i + 1}</td>
                <td
                  className={`border flex items-center justify-center py-1 ${i === bestIndex ? "text-emerald-400" : i === worstIndex ? "text-red-400" : ""}`}
                >
                  {solves.length > i ? (
                    editable ? (
                      <button
                        className="cursor-pointer px-2 hover:bg-zinc-100/10 rounded-md transition-all duration-300"
                        onClick={() => setEditingIndex(i)}
                      >
                        {formatTimeDisplay(solves[i].time, solves[i].penalty)}
                      </button>
                    ) : (
                      <span>
                        {formatTimeDisplay(solves[i].time, solves[i].penalty)}
                      </span>
                    )
                  ) : (
                    "–"
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      {editingIndex !== null && (
        <EditResult
          solve={solves[editingIndex]}
          onClose={() => setEditingIndex(null)}
          onSubmit={editTime}
        />
      )}
    </>
  );
};

export default ContestResultTable;
