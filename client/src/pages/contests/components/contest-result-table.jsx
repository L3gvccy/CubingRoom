import React, { useState } from "react";
import { formatTimeDisplay, getNameAndFormat } from "@/utils/tools";
import EditResult from "@/components/edit-result";

const ContestResultTable = ({ event, solves, editable }) => {
  const [editingIndex, setEditingIndex] = useState(null);

  if (solves.length > 0)
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
                  <td className="border flex items-center justify-center py-1">
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
          />
        )}
      </>
    );
};

export default ContestResultTable;
