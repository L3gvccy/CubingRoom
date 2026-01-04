import React, { useState } from "react";
import ContestDateSelect from "./components/contest-date-select";
import ContestCard from "./components/contest-card";

const Contests = () => {
  const [date, setDate] = useState(new Date());

  const events = [
    "333",
    "222",
    "444",
    "555",
    "666",
    "777",
    "333oh",
    "clock",
    "megaminx",
    "pyraminx",
    "skewb",
    "sq1",
  ];

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col w-full max-w-342 gap-5">
        <p className="text-2xl font-bold text-center">Контести</p>
        <ContestDateSelect value={date} onChange={setDate} />
        <div className="flex gap-5 justify-center flex-wrap">
          {events.map((event) => (
            <ContestCard event={event} key={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;
