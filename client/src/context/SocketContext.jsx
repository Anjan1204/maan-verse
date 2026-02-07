import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL;
        if (!socketUrl) {
            console.warn('VITE_API_URL is not defined. Socket.io might not connect.');
            return;
        }
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
