import { findItemByProductCode, insertOrUpdateItem } from './db/index.js';
import { scrapeCrazySundays } from './scraper/index.js';
import logger from './config/index.js';
import { notifyTelegram } from './utils/notifier.js';
import { connectToMongo } from './db/mongoose.js';
import { isTechItem, getCategory } from './utils/classifier.js';

async function runNotifier() {
  const items = await scrapeCrazySundays();
  let newCount = 0;
  let priceUpdateCount = 0;

  for (const item of items) {
    const exists = await findItemByProductCode(item.productCode);
    const isTech = isTechItem(item);
    item.category = getCategory(item);

    if (!exists) {
      await insertOrUpdateItem(item);
      newCount++;
      if (isTech) {
        await notifyTelegram(
          `🆕 <b>New Item:</b> ${item.title}\n💶 Price: ${item.price}\n🔗 <a href='${item.url}'>View Item</a>`,
          item.image,
        );
      } else {
        logger.info(`Skipping notification for non-tech item: ${item.title}`);
      }
    } else {
      const lastPrice = exists.priceHistory?.[exists.priceHistory.length - 1]?.price;
      if (lastPrice !== item.price) {
        await insertOrUpdateItem(item);
        priceUpdateCount++;
        if (isTech) {
          await notifyTelegram(
            `🔔 <b>Price Update:</b> ${item.title}\n💶 Old Price: ${lastPrice}\n💶 New Price: ${item.price}\n🔗 <a href='${item.url}'>View Item</a>`,
            item.image,
          );
        } else {
          logger.info(`Skipping price update notification for non-tech item: ${item.title}`);
        }
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
