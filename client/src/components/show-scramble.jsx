import React from "react";

const ShowScramble = ({ event, scramble }) => {
  return (
    <div className="flex w-full justify-center">
      {event === "megaminx" ? (
        <pre className="text-sm sm:text-[18px] text-start w-fit">
          {scramble}
        </pre>
      ) : (
        <div className="text-md md:text-lg text-center px-4">{scramble}</div>
      )}
    </div>
  );
};

export default ShowScramble;
