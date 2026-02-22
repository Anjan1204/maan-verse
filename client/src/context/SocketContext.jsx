import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export { SocketContext };

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Use the base URL for socket connection, not the API URL
        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
            console.error('SOCKET_URL (VITE_API_URL) is missing in production!');
        }

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
