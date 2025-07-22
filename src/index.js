import { initDb, findItemByProductCode, insertOrUpdateItem } from './db/index.js';
import { scrapeCrazySundays } from './scraper/index.js';
import { scheduleWeeklyTask } from './scheduler/index.js';

async function runNotifier() {
  await initDb();
  const items = await scrapeCrazySundays();
  let newCount = 0;
  let priceUpdateCount = 0;

  for (const item of items) {
    const exists = await findItemByProductCode(item.productCode);
    if (!exists) {
      await insertOrUpdateItem(item);
      newCount++;
    } else {
      // Only update if price has changed
      const lastPrice = exists.priceHistory?.[exists.priceHistory.length - 1]?.price;
      if (lastPrice !== item.price) {
        await insertOrUpdateItem(item);
        priceUpdateCount++;
      }
    }
  }

  console.log(
    `Scraped ${items.length} items. New items added: ${newCount}. Price updates: ${priceUpdateCount}`,
  );
}

if (process.env.NODE_ENV === 'production') {
  scheduleWeeklyTask(runNotifier);
  console.log('Scheduler started: will run every Sunday at 1am');
} else {
  runNotifier().catch((err) => {
    console.error('Error running notifier:', err);
    process.exit(1);
  });
}
