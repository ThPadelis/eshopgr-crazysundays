import cron from 'node-cron';

export function scheduleWeeklyTask(task) {
  // Runs every Sunday at 1am
  cron.schedule('0 1 * * 0', async () => {
    try {
      await task();
    } catch (err) {
      console.error('Scheduled task error:', err);
    }
  });
} 