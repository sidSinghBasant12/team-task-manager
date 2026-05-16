const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const logger = require('../config/logger');

// Dummy email worker
const emailWorker = new Worker('email', async job => {
  logger.info(`Processing email job: ${job.id}`);
  // Simulated email send
  await new Promise(resolve => setTimeout(resolve, 1000));
  logger.info(`Email job ${job.id} completed`);
}, { connection: redisConnection });

// Workload worker (we'll implement workload balancing here)
const workloadWorker = new Worker('workload', async job => {
  logger.info(`Processing workload job: ${job.id} for team ${job.data.teamId}`);
  // Call workload service here (will implement next)
  const workloadService = require('../services/workload.service');
  await workloadService.balanceWorkload(job.data.teamId);
  logger.info(`Workload job ${job.id} completed`);
}, { connection: redisConnection });

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with error ${err.message}`);
});
workloadWorker.on('failed', (job, err) => {
  logger.error(`Workload Job ${job?.id} failed with error ${err.message}`);
});

module.exports = {
  emailWorker,
  workloadWorker,
};
