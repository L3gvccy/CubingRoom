import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/themeContext.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { TimerProvider } from "./context/timerContext.jsx";
import TimerFullscreen from "./components/timer/timer-fullscreen.jsx";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uk";
import { SocketProvider } from "./context/socketContext.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const supportedLocales = ["uk", "en"];
const browserLocale = navigator.language || "en";
const locale = browserLocale.split("-")[0];

dayjs.locale(supportedLocales.includes(locale) ? locale : "uk");

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <SocketProvider>
    <ThemeProvider>
      <TooltipProvider>
        <App />
        <Toaster position="top-center" closeButton />
      </TooltipProvider>
    </ThemeProvider>
  </SocketProvider>,
  // </StrictMode>,
);
