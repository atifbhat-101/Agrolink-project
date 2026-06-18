import { useEffect, useState } from 'react';
import { getSocket, initiateSocketConnection } from '../services/socket';

export const useSocket = (userId) => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const sock = initiateSocketConnection(userId);
    setSocketInstance(sock);

    return () => {
      // Keep socket alive across components unless explicitly logged out
    };
  }, [userId]);

  return socketInstance;
};
