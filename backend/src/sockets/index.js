const { Server } = require('socket.io');
const logger = require('../config/logger');

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      logger.info(`Socket ${socket.id} joined room user_${userId}`);
    });

    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      logger.info(`Socket ${socket.id} joined room project_${projectId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSockets, getIO };
