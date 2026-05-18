const Redis = require('ioredis');
const logger = require('./logger');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

if (!process.env.REDIS_URL) {
  logger.warn('REDIS_URL is not defined in environment variables. Falling back to redis://localhost:6379');
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
