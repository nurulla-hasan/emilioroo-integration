"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext({
    socket: null,
    sendMessage: () => { },
    // sendSeen: () => { },
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const { accessToken: token } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const newSocket = io("http://10.10.20.70:4000", {
            query: { token },
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [ token ]);

    // 👉 Send message
    const sendMessage = (payload) => {
        if (socket) {
            socket.emit("send-message", payload);
        }
    };

    // 👉 Send seen event
    const sendSeen = (payload) => {
        if (socket) {
            socket.emit("seen", payload);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage, sendSeen }}>
            {children}
        </SocketContext.Provider>
    );
}
