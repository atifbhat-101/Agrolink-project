import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  if (userId) {
    socket.emit('setup', userId);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
