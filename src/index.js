import { findItemByProductCode, insertOrUpdateItem } from './db/index.js';
import { scrapeCrazySundays } from './scraper/index.js';
import logger from './config/index.js';
import { notifyTelegram } from './utils/notifier.js';
import { connectToMongo } from './db/mongoose.js';

async function runNotifier() {
  const items = await scrapeCrazySundays();
  let newCount = 0;
  let priceUpdateCount = 0;

  for (const item of items) {
    const exists = await findItemByProductCode(item.productCode);
    if (!exists) {
      await insertOrUpdateItem(item);
      newCount++;
      await notifyTelegram(
        `🆕 <b>New Item:</b> ${item.title}\n💶 Price: ${item.price}\n🔗 <a href='${item.url}'>View Item</a>`,
        item.image,
      );
    } else {
      const lastPrice = exists.priceHistory?.[exists.priceHistory.length - 1]?.price;
      if (lastPrice !== item.price) {
        await insertOrUpdateItem(item);
        priceUpdateCount++;
        await notifyTelegram(
          `🔔 <b>Price Update:</b> ${item.title}\n💶 Old Price: ${lastPrice}\n💶 New Price: ${item.price}\n🔗 <a href='${item.url}'>View Item</a>`,
          item.image,
        );
      }
    }
  }

  logger.info(
    `Scraped ${items.length} items. New items added: ${newCount}. Price updates: ${priceUpdateCount}`,
  );
}

async function main() {
  await connectToMongo();
  await runNotifier();
  logger.info('Exiting...');
  process.exit(0);
}

main().catch((err) => {
  logger.error('Startup error:', err);
  process.exit(1);
});
