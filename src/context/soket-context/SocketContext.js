"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext({
    socket: null,
    sendMessage: () => { },
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const { accessToken: token } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const newSocket = io("https://rnj64vmh-4000.inc1.devtunnels.ms", {
            query: { token },
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [ token ]);

    // Send message
    const sendMessage = (payload) => {
        if (socket) {
            socket.emit("send-message", payload);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
}
