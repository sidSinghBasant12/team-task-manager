require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const logger = require('./src/config/logger');
const { initSockets } = require('./src/sockets');

const server = http.createServer(app);

// Setup Socket.IO
initSockets(server);

// Start BullMQ workers
require('./src/jobs/workers');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
