const Redis = require('ioredis');
const logger = require('./logger');

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required by bullmq
};

const redisConnection = new Redis(redisOptions);

redisConnection.on('error', (err) => {
  logger.error('Redis Connection Error:', err);
});

redisConnection.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

module.exports = redisConnection;
