const socketIO = require('socket.io');
let io = null;
const userSockets = new Map();

const initializeSocket = (server) => {
  if (io) return io;

  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    const userId = socket.handshake.query.userId;
    
    if (userId) {
      userSockets.set(userId, socket.id);
      socket.join(userId.toString());
    }

    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('register', ({ userId }) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        socket.join(userId.toString());
      }
    });

    socket.on('disconnect', () => {
      if (userId) {
        userSockets.delete(userId);
        socket.leave(userId.toString());
      }
      console.log('Client disconnected');
    });
  });

  return io;
};

const sendNotification = async (userId, notification) => {
  try {
    if (!io) throw new Error('Socket.IO not initialized');
    io.to(userId.toString()).emit('newNotification', notification);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initializeSocket, getIO, sendNotification }; 