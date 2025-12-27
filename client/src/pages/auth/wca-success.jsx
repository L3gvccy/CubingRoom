import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ME_ROUTE } from "@/utils/constants";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WcaSuccess = () => {
  const navigate = useNavigate();
  const { setUserData } = useAppStore();

  const fetch = async () => {
    await apiClient
      .get(GET_ME_ROUTE, { withCredentials: true })
      .then((res) => {
        toast.success("Ви успішно авторизувались!");
        navigate("/");
        setUserData(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data);
      });
  };

  useEffect(() => {
    fetch();
  }, []);
  return <div>WcaSuccess</div>;
};

export default WcaSuccess;
