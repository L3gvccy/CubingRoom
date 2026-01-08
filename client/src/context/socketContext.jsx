import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userData } = useAppStore();

  useEffect(() => {
    if (userData && !socket.current) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userData.id },
      });

      return () => {
        socket.current.disconnect();
        socket.current = null;
      };
    }
  }, [userData?.id]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
