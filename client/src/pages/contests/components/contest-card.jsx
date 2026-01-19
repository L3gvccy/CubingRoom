import { getNameAndFormat } from "@/utils/tools";

import React from "react";
import { useNavigate } from "react-router-dom";

const ContestCard = ({ event, id, active }) => {
  //   const { event, _id, active } = contest;
  const navigate = useNavigate();
  const [name, _] = getNameAndFormat(event);

  const bgActive = "from-violet-600 via-violet-500 to-violet-700";
  const bgInactive = "from-zinc-600 via-zinc-500 to-zinc-700";

  return (
    <div
      onClick={() => {
        navigate(`/contests/${id}`);
      }}
      className={`py-6 w-28 md:w-42 flex flex-col gap-4 justify-center rounded-xl group bg-size-[200%_200%] ease-out bg-linear-to-br ${
        active ? bgActive : bgInactive
      } cursor-pointer hover:bg-position-[100%_100%] transition-all duration-500`}
    >
      <img
        src={`/event-icons/${event}.svg`}
        alt={event}
        className="px-6 group-hover:scale-105 ease-out transition-all duration-500"
      />
      <p className="text-xl text-zinc-100 font-semibold text-center">{name}</p>
    </div>
  );
};

export default ContestCard;
