import EventSelect from "@/components/event-select";
import Timer from "@/components/timer/timer";
import TimerFullscreen from "@/components/timer/timer-fullscreen";
import TimerMini from "@/components/timer/timer-mini";
import { apiClient } from "@/lib/api-client";
import { GEN_SCR } from "@/utils/constants";
import { formatTimeDisplay, getScrambler } from "@/utils/tools";
import React, { useState, useEffect, useRef } from "react";

const Test = () => {
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
      <EventSelect value={event} setEvent={setEvent} />
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
      <Timer handleSubmit={handleSubmit} />
      {results.map((res, i) => (
        <p key={i}>{formatTimeDisplay(res.time, res.penalty)}</p>
      ))}
    </>
  );
};

export default Test;
