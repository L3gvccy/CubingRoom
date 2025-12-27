import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Auth from "./pages/auth/auth";
import WcaSuccess from "./pages/auth/wca-success";
import Layout from "./pages/layout/layout";
import Main from "./pages/home/main";

function App() {
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
