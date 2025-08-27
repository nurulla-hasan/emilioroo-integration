"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import jwt from 'jsonwebtoken'; // Import jwt

const SocketContext = createContext({
    socket: null,
    sendMessage: () => { },
    sendSeen: () => { },
    currentUserId: null, // Add currentUserId to context
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const { accessToken: token } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // New state for currentUserId

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwt.decode(token); // Decode without verifying for client-side use
                if (decoded && decoded.profileId) {
                    setCurrentUserId(decoded.profileId);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setCurrentUserId(null);
            }
        } else {
            setCurrentUserId(null);
        }

        const newSocket = io("http://10.10.20.70:4000", {
            query: { token },
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected");
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
            // console.log("📤 Sent message:", payload);
        }
    };

    // 👉 Send seen event
    const sendSeen = (payload) => {
        if (socket) {
            socket.emit("seen", payload);
            console.log("👁 Sent seen event:", payload);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage, sendSeen, currentUserId }}>
            {children}
        </SocketContext.Provider>
    );
}
