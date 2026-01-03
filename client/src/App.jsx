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
import Profile from "./pages/profile/profile";
import Loader from "./components/loader/loader";
import WcaLinkSuccess from "./pages/profile/components/wca-link-success";
import Test from "./pages/test/test";

function App() {
  const { setUserData } = useAppStore();
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    await apiClient
      .get(GET_ME_ROUTE, { withCredentials: true })
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        setUserData(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getUserData();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/rooms" element={<Main />} />
          <Route path="/contests" element={<Main />} />

          <Route path="/users/:id" element={<Profile />} />
        </Route>

        <Route path="/auth" element={<Auth />} />

        <Route path="/wca-success" element={<WcaSuccess />} />
        <Route path="/wca-link-success" element={<WcaLinkSuccess />} />

        <Route path="/test" element={<Test />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
