import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import logger from '../config/index.js';
const CRAZY_SUNDAYS_URL = 'https://www.e-shop.gr/crazysundays';

export async function scrapeCrazySundays() {
  const response = await axios.get(CRAZY_SUNDAYS_URL, { responseType: 'arraybuffer' });
  const decodedHtml = iconv.decode(Buffer.from(response.data), 'iso-8859-7');
  const $ = cheerio.load(decodedHtml);
  const items = [];

  $('.crazy-container').each((_, el) => {
    const title = $(el).find('.crazy-title-row').text().trim();
    const url = $(el).find('.crazy-title-row a').attr('href');
    const priceRaw = $(el).find('.web-prices-v2').text().trim();
    const priceMatch = priceRaw.match(/([\d.,]+)/);
    const price = priceMatch ? priceMatch[1].replace(',', '.') : '';
    const image = $(el).find('img').attr('src') || '';
    // Extracts the SKU/productCode from the end of the title using a regex pattern
    const skuMatch = title.match(/([A-Z0-9]+\.[0-9A-Z]+)$/i);
    const productCode = skuMatch ? skuMatch[1] : '';

    if (title && url) {
      logger.info(`Parsed item: ${title} | Price: ${price}`);
      items.push({
        title,
        url: `https://www.e-shop.gr/${url}`,
        price,
        image: `https://www.e-shop.gr/${image}`,
        productCode,
      });
    }
  });

  return items;
} 