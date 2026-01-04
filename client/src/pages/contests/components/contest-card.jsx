import { getNameAndFormat } from "@/utils/tools";

import React from "react";
import { useNavigate } from "react-router-dom";

const ContestCard = ({ event, id }) => {
  const navigate = useNavigate();
  const [name, _] = getNameAndFormat(event);

  return (
    <div
      onClick={() => {
        navigate(`/`);
      }}
      className=" py-6 w-28 md:w-42 flex flex-col gap-4 justify-center rounded-xl group bg-size-[200%_200%] bg-linear-to-br from-violet-600 via-violet-500 to-violet-700 cursor-pointer hover:bg-position-[100%_100%] transition-all duration-300"
    >
      <img
        src={`/event-icons/${event}.svg`}
        alt={event}
        className="px-6 invert group-hover:scale-105 transition-all duration-300"
      />
      <p className="text-xl font-semibold text-center">{name}</p>
    </div>
  );
};

export default ContestCard;
