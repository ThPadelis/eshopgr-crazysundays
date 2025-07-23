import cron from 'node-cron';
import logger from '../config/index.js';

export function scheduleWeeklyTask(task) {
  // Runs every Sunday at 1am
  cron.schedule('0 1 * * 0', async () => {
    try {
      await task();
    } catch (err) {
      logger.error('Scheduled task error:', err);
    }
  });
} 