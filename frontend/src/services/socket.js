import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://agrolink-project.onrender.com';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

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
