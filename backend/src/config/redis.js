const Redis = require('ioredis');
const logger = require('./logger');

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in environment variables');
}

const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  logger.error('Redis Connection Error:', err);
});

redisConnection.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

module.exports = redisConnection;
