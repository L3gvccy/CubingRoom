import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ME_ROUTE } from "@/utils/constants";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const WcaLinkSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const { userData, setUserData } = useAppStore();

  const fetch = async () => {
    await apiClient
      .get(GET_ME_ROUTE, { withCredentials: true })
      .then((res) => {
        if (error === "invalid_callback") {
          toast.error("Невірний callback від WCA");
          navigate(`/users/${userData.id}`);
        } else if (error === "invalid_state") {
          toast.error("Помилка безпеки (state mismatch)");
          navigate(`/users/${userData.id}`);
        } else if (error === "not_authorized") {
          toast.error("Потрібно увійти до акаунту");
          navigate(`/`);
        } else if (error === "already_linked") {
          toast.error("Цей WCA акаунт вже привʼязаний");
          navigate(`/users/${userData.id}`);
        } else {
          toast.success("Ви успішно прив'язали WCA!");
          navigate(`/users/${res.data.user.id}`);
          setUserData(res.data.user);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message);
      });
  };

  useEffect(() => {
    fetch();
  }, []);
  return <div>WcaLinkSuccess</div>;
};

export default WcaLinkSuccess;
