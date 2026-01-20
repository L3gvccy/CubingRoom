import GlobalTimer from "@/components/global-timer";
import Loader from "@/components/loader/loader";
import ShowScramble from "@/components/show-scramble";
import TimerTypeSelect from "@/components/timer-type-select";
import Timer from "@/components/timer/timer";
import { apiClient } from "@/lib/api-client";
import {
  ADD_CONTEST_TIME,
  GET_CONTEST_EVENT,
  GET_CONTEST_RESULT,
} from "@/utils/constants";
import { formatTimeDisplay, getDisplay, getNameAndFormat } from "@/utils/tools";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContestResultTable from "./components/contest-result-table";

const Contest = () => {
  const naviagate = useNavigate();
  const { contestEventId } = useParams();

  const [loading, setLoading] = useState(true);

  const [contest, setContest] = useState();
  const [event, setEvent] = useState();
  const [scrambles, setScrambles] = useState([]);
  const [results, setResults] = useState([]);

  const [myResult, setMyResult] = useState();
  const [solves, setSolves] = useState([]);

  const getContestEvent = async () => {
    await apiClient
      .get(GET_CONTEST_EVENT(contestEventId), { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setContest(res.data.contestEvent.contest);
        setEvent(res.data.contestEvent);
        setScrambles(res.data.scrambles);
        setResults(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMyContestResult = async () => {
    await apiClient
      .get(GET_CONTEST_RESULT(contestEventId), {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setMyResult(res.data.contestResult);
        setSolves(res.data.solves);
      });
  };

  const addTime = async (solve) => {
    await apiClient
      .post(ADD_CONTEST_TIME(contestEventId), solve, {
        withCredentials: true,
      })
      .then((res) => {
        setSolves(res.data.solves);
      });
  };

  useEffect(() => {
    getContestEvent();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (contest && contest.isActive) {
        await getMyContestResult();
      }
      setLoading(false);
    };
    fetchData();
  }, [contest]);

  if (!loading && contest && event)
    return (
      <div className="flex w-full justify-center py-4">
        <div className="flex flex-col w-full max-w-342 gap-5">
          <div className="flex flex-col gap-2 items-center border-b pb-4">
            <img
              src={`/event-icons/${event.event}.svg`}
              alt="event-logo"
              className="w-16"
            />
            <div className="flex gap-2 items-center justify-center">
              <h1 className="text-2xl font-semibold">Контест</h1>
              <h1 className="text-2xl font-semibold">
                {getNameAndFormat(event.event)[0]}
              </h1>
            </div>

            <p className="text-sm opacity-75">
              {dayjs(contest.startDate).format("L")} -{" "}
              {dayjs(contest.endDate).format("L")}
            </p>
          </div>
          {/* Контест активний і користувач може збирати */}
          {contest.isActive &&
            solves &&
            solves.length < getNameAndFormat(event.event)[1].slice(2) && (
              <>
                <div className="flex justify-end">
                  <TimerTypeSelect />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <ShowScramble
                    scramble={
                      scrambles.find((s) => s.index === solves.length + 1)
                        ?.scramble
                    }
                    event={event.event}
                  />
                </div>
                <div className="flex justify-center items-center py-2 h-22.5">
                  <GlobalTimer handleSubmit={addTime} />
                </div>

                <div className="flex justify-center">
                  <ContestResultTable
                    event={event.event}
                    solves={solves}
                    editable={true}
                  />
                </div>

                <div className="flex justify-end">
                  <scramble-display
                    event={getDisplay(event.event)}
                    scramble={
                      scrambles.find((s) => s.index === solves.length + 1)
                        ?.scramble
                    }
                    className="max-w-86"
                  ></scramble-display>
                </div>
              </>
            )}
          {/* Контест активний, але користувач завершив всі спроби, але не підтвердив результат */}
          {/* Контест активний і користувач підтвердив результат */}
          {/* Контест завершено */}
        </div>
      </div>
    );

  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader />
    </div>
  );
};

export default Contest;
