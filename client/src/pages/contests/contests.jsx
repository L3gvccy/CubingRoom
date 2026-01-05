import React, { useState, useEffect } from "react";
import ContestDateSelect from "./components/contest-date-select";
import ContestCard from "./components/contest-card";
import Loader from "@/components/loader/loader";

const Contests = () => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [contests, setContests] = useState([]);
  const [contestsToDisplay, setContestsToDisplay] = useState([]);

  const events_test = [
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

  const getAllContests = async () => {};

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col w-full max-w-342 gap-5">
        <p className="text-2xl font-bold text-center">Контести</p>
        <ContestDateSelect value={date} onChange={setDate} />
        <div className="flex gap-5 justify-center flex-wrap">
          {events_test.map((event) => (
            <ContestCard event={event} active={1} key={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;
