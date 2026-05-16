const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

// Define queues
const emailQueue = new Queue('email', { connection: redisConnection });
const workloadQueue = new Queue('workload', { connection: redisConnection });

module.exports = {
  emailQueue,
  workloadQueue,
};
