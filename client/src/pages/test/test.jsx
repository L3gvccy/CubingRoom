import EventSelect from "@/components/event-select";
import TimeInput from "@/components/timeInput/time-input";
import TimerTypeSelect from "@/components/timer-type-select";
import Timer from "@/components/timer/timer";
import TimerFullscreen from "@/components/timer/timer-fullscreen";
import TimerMini from "@/components/timer/timer-mini";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GEN_SCR } from "@/utils/constants";
import { formatTimeDisplay, getScrambler } from "@/utils/tools";
import React, { useState, useEffect, useRef } from "react";

const Test = () => {
  const { userData } = useAppStore();
  const [event, setEvent] = useState("333");
  const [scramble, setScramble] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (result) => {
    setResults([result, ...results]);
    await getScramble();
  };

  const getScramble = async () => {
    const scr = getScrambler(event);
    await apiClient
      .post(
        GEN_SCR,
        { event: scr[0], length: scr[1] },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.scramble);
        setScramble(res.data.scramble);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  useEffect(() => {
    setResults([]);
    getScramble();
  }, [event]);

  useEffect(() => {
    getScramble();
  }, []);
  return (
    <>
      <div className="flex w-full items-center justify-center p-2">
        <div className="flex justify-between max-w-342 w-full">
          <EventSelect value={event} setEvent={setEvent} />
          <TimerTypeSelect />
        </div>
      </div>

      {scramble.scramble ? (
        <>
          <div className="p-4 text-center wrap-break-word">
            {event === "megaminx" ? (
              <pre>{scramble.scramble}</pre>
            ) : (
              scramble.scramble
            )}
          </div>
          <div
            className="w-64 h-48 mx-auto flex items-center justify-center
             [&>svg]:max-h-full
             [&>svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: scramble.image }}
          />
        </>
      ) : (
        <div className="w-full h-32 text-center">Generating scramble</div>
      )}
      {userData.timerType === "keyboard" ? (
        <Timer handleSubmit={handleSubmit} />
      ) : (
        <TimeInput handleSubmit={handleSubmit} />
      )}

      {results.map((res, i) => (
        <p
          key={i}
          onClick={() => {
            console.log(res);
          }}
        >
          {formatTimeDisplay(res.time, res.penalty)}
        </p>
      ))}
    </>
  );
};

export default Test;
