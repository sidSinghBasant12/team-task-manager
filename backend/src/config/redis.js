const Redis = require('ioredis');
const logger = require('./logger');

const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  logger.error('Redis Connection Error:', err);
});

redisConnection.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

module.exports = redisConnection;
