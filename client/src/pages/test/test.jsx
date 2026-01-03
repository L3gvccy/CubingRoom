import Timer from "@/components/timer/timer";
import TimerFullscreen from "@/components/timer/timer-fullscreen";
import TimerMini from "@/components/timer/timer-mini";
import { apiClient } from "@/lib/api-client";
import { GEN_SCR } from "@/utils/constants";
import { formatTimeDisplay } from "@/utils/tools";
import React, { useState, useEffect } from "react";

const Test = () => {
  const [event, setEvent] = useState("333");
  const [scramble, setScramble] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (result) => {
    setResults([...results, result]);
    await getScramble();
  };

  const getScramble = async () => {
    await apiClient
      .post(GEN_SCR, { event }, { withCredentials: true })
      .then((res) => {
        console.log(res.data.scramble);
        setScramble(res.data.scramble);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  useEffect(() => {
    getScramble();
  }, []);
  return (
    <>
      {scramble.scramble ? (
        <>
          <div className="p-4 text-center">{scramble.scramble}</div>
          <div
            className="w-64 mx-auto"
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
