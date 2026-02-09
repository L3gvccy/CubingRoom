import React from "react";

const Meadls = ({ medals }) => {
  return (
    <>
      <table className="max-w-[90vw] w-full  ">
        <thead>
          <tr>
            <td
              colSpan={3}
              className="text-center font-semibold tracking-wide text-xl p-2"
            >
              Медалі
            </td>
          </tr>
        </thead>
        <tbody className="bg-zinc-100/30 dark:bg-zinc-800/30">
          <tr className="border-y">
            <td className="text-lg font-medium text-center p-1">Золото 🥇</td>
            <td className="text-lg font-medium text-center p-1">Срібло 🥈</td>
            <td className="text-lg font-medium text-center p-1">Бронза 🥉</td>
          </tr>
          <tr>
            <td className="text-lg font-normal text-center p-1">
              {medals.gold}
            </td>
            <td className="text-lg font-normal text-center p-1">
              {medals.silver}
            </td>
            <td className="text-lg font-normal text-center p-1">
              {medals.bronze}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Meadls;
