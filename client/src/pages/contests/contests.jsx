import React, { useState, useEffect } from "react";
import ContestDateSelect from "./components/contest-date-select";
import ContestCard from "./components/contest-card";
import Loader from "@/components/loader/loader";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTESTS } from "@/utils/constants";
import { eventOrder } from "@/utils/tools";

const Contests = () => {
  const [loading, setLoading] = useState(true);

  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState();

  const getAllContests = async () => {
    await apiClient
      .get(GET_ALL_CONTESTS, { withCredentials: true })
      .then((res) => {
        const contests = res.data.contests;
        setContests(res.data.contests);
        const activeContest = contests.find((contest) => contest.isActive);

        if (activeContest) {
          setSelectedContest(activeContest);
        } else if (contests.length > 0) {
          setSelectedContest(contests[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllContests();
  }, []);

  useEffect(() => {
    if (!selectedContest) return;

    setSelectedContest((prev) => ({
      ...prev,
      contests: [...prev.contests].sort(
        (a, b) => eventOrder.indexOf(a.event) - eventOrder.indexOf(b.event),
      ),
    }));
  }, [selectedContest?.id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!selectedContest || contests.length === 0) {
    return (
      <div className="flex flex-col gap-5 w-full justify-center py-4">
        <p className="text-2xl font-bold text-center">Контести</p>
        <p className="opacity-75 text-lg text-center">
          Немає доступних контестів
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex flex-col w-full max-w-342 gap-5">
        <p className="text-2xl font-bold text-center">Контести</p>
        <ContestDateSelect
          contests={contests}
          selectedContest={selectedContest}
          setSelectedContest={setSelectedContest}
        />
        <div className="flex gap-5 justify-center flex-wrap">
          {selectedContest.contests.map((c) => (
            <ContestCard
              event={c.event}
              id={c.id}
              active={selectedContest.isActive}
              key={c.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;
