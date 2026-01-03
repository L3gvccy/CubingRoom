import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/themeContext.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { TimerProvider } from "./context/timerContext.jsx";
import TimerFullscreen from "./components/timer/timer-fullscreen.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider>
    <App />
    <Toaster position="top-center" closeButton />
  </ThemeProvider>
  // </StrictMode>,
);
