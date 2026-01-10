import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketState, setSocketState] = useState(null);
  const { userData } = useAppStore();

  useEffect(() => {
    if (!userData) return;

    const socket = io(HOST, {
      withCredentials: true,
      query: { userId: userData.id },
    });

    socketRef.current = socket;
    setSocketState(socket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketState(null);
      }
    };
  }, [userData?.id]);

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
};
