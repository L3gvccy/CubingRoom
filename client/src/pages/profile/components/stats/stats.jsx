import { apiClient } from "@/lib/api-client";
import { GET_MEDALS } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import Meadls from "./components/medals";

const Stats = ({ userId }) => {
  const [medals, setMedals] = useState({
    gold: 0,
    silver: 0,
    bronze: 0,
  });
  const getMedals = async () => {
    await apiClient
      .get(GET_MEDALS(userId), { withCredentials: true })
      .then((res) => {
        setMedals(res.data.medals);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getMedals();
  }, []);
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="my-4 text-2xl tracking-wide font-semibold">Результати</p>
      <Meadls medals={medals} />
    </div>
  );
};

export default Stats;
