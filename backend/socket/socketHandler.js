const users = new Map(); // Store online user socket IDs mapping (userId -> socketId)

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Connected client: ${socket.id}`);

    // Register active user session
    socket.on('setup', (userId) => {
      socket.join(userId);
      users.set(userId, socket.id);
      socket.emit('connected');
    });

    // Handle joining chat rooms
    socket.on('join_chat', (room) => {
      socket.join(room);
    });

    // Process new typing states
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'));

    // Handle user disconnects
    socket.on('disconnect', () => {
      for (let [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
      console.log(`Disconnected client: ${socket.id}`);
    });
  });
};

export default socketHandler;
