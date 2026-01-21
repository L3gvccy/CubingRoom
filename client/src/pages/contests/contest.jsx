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
  SUBMIT_CONTEST_RESULT,
} from "@/utils/constants";
import {
  calculateAverage,
  formatTimeDisplay,
  getDisplay,
  getNameAndFormat,
} from "@/utils/tools";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContestResultTable from "./components/contest-result-table";
import { toast } from "sonner";

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

  const getSingleFromSolves = (solves) => {
    let single = Number.MAX_SAFE_INTEGER;
    solves.forEach((solve) => {
      if (solve.finalTime < single) {
        single = solve.finalTime;
      }
    });
    return single;
  };

  const getAverageFromSolves = (solves) => {
    const length = Number(getNameAndFormat(event.event)[1].slice(2));
    return calculateAverage([...solves], length);
  };

  const submitResult = async () => {
    const single = getSingleFromSolves(solves);

    const average = getAverageFromSolves(solves);

    await apiClient
      .post(
        SUBMIT_CONTEST_RESULT(contestEventId),
        { best: single, average },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        setMyResult(res.data.updatedResult);
        setResults(res.data.updatedResults);
        toast.success("Результат успішно підтверджено");
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
      <div className="flex w-full justify-center py-4 px-2">
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
                    setSolves={setSolves}
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
          {/* Контест активний, користувач завершив всі спроби, але не підтвердив результат */}

          {contest.isActive &&
            myResult &&
            !myResult.submitted &&
            solves.length >= getNameAndFormat(event.event)[1].slice(2) && (
              <div className="flex flex-col gap-4 items-center">
                <h2 className="text-lg font-semibold">Усі спроби завершено!</h2>
                <p className="text-center opacity-90">
                  Ви все ще можете редагувати результати до підтвердження.
                </p>
                <ContestResultTable
                  event={event.event}
                  solves={solves}
                  setSolves={setSolves}
                  editable={true}
                />
                <div className="flex flex-col text-lg justify-center items-center">
                  <div className="flex gap-2">
                    <span className="font-semibold">Single: </span>
                    <span>
                      {formatTimeDisplay(getSingleFromSolves(solves))}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">
                      {getNameAndFormat(event.event)[1]}:{" "}
                    </span>
                    <span>
                      {getAverageFromSolves(solves)
                        ? formatTimeDisplay(getAverageFromSolves(solves))
                        : "DNF"}
                    </span>
                  </div>
                </div>

                <button
                  className="text-lg items-center bg-violet-700 hover:bg-violet-600 px-4 py-2 w-full max-w-64 rounded-lg cursor-pointer transition-all duration-300"
                  onClick={submitResult}
                >
                  Підтвердити
                </button>
              </div>
            )}

          {/* Контест активний і користувач підтвердив результат */}

          {contest.isActive && myResult && myResult.submitted && (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-lg font-semibold">Скрамбли:</h2>
              <div className="flex flex-col gap-2 w-full">
                {scrambles.map((s) => (
                  <div
                    key={s.index}
                    className="flex gap-2 px-4 py-2 bg-zinc-800 rounded-lg"
                  >
                    <span>{s.index}.</span>
                    {event.event === "megaminx" ? (
                      <pre className="text-start w-fit">{s.scramble}</pre>
                    ) : (
                      <div className="px-4">{s.scramble}</div>
                    )}
                  </div>
                ))}
              </div>
              <h2 className="text-lg font-semibold">Результат підтверджено!</h2>
              <ContestResultTable
                event={event.event}
                solves={solves}
                setSolves={setSolves}
                editable={false}
              />

              <div className="flex flex-col text-lg justify-center items-center">
                <div className="flex gap-2">
                  <span className="font-semibold">Single: </span>
                  <span>{formatTimeDisplay(getSingleFromSolves(solves))}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">
                    {getNameAndFormat(event.event)[1]}:{" "}
                  </span>
                  <span>
                    {getAverageFromSolves(solves)
                      ? formatTimeDisplay(getAverageFromSolves(solves))
                      : "DNF"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Контест завершено */}
          {!contest.isActive && (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-lg font-semibold">Контест завершено!</h2>
              <h2 className="text-lg font-semibold">Скрамбли:</h2>
              <div className="flex flex-col gap-2 w-full">
                {scrambles.map((s) => (
                  <div
                    key={s.index}
                    className="flex gap-2 px-4 py-2 bg-zinc-800 rounded-lg"
                  >
                    <span>{s.index}.</span>
                    {event.event === "megaminx" ? (
                      <pre className="text-start w-fit">{s.scramble}</pre>
                    ) : (
                      <div className="px-4">{s.scramble}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
