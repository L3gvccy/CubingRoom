import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Auth from "./pages/auth/auth";
import WcaSuccess from "./pages/auth/wca-success";
import Layout from "./pages/layout/layout";
import Main from "./pages/home/main";
import { apiClient } from "./lib/api-client";
import { GET_ME_ROUTE } from "./utils/constants";
import { useAppStore } from "./store";

function App() {
  const { setUserData } = useAppStore();

  const getUserData = async () => {
    await apiClient
      .get(GET_ME_ROUTE, { withCredentials: true })
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        setUserData(undefined);
      });
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/rooms" element={<Main />} />
          <Route path="/contests" element={<Main />} />
        </Route>

        <Route path="/auth" element={<Auth />} />

        <Route path="/wca-success" element={<WcaSuccess />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
