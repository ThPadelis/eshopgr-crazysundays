import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

const dbFile = path.resolve(process.cwd(), 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { defaultData: { items: [] } });

export async function initDb() {
  await db.read();
  db.data.items = db.data.items || [];
  await db.write();
  return db;
}

export function getDb() {
  if (!db.data) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

export async function insertItem({ title, url, price, image, productCode }) {
  await db.read();
  db.data.items = db.data.items || [];
  db.data.items.push({
    title,
    url,
    price,
    image,
    productCode,
    created_at: new Date().toISOString(),
  });
  await db.write();
}

export async function getAllItems() {
  await db.read();
  const items = db.data.items || [];
  return items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function findItemByTitle(title) {
  await db.read();
  const items = db.data.items || [];
  return items.find((item) => item.title === title);
}

export async function findItemByProductCode(productCode) {
  await db.read();
  const items = db.data.items || [];
  return items.find((item) => item.productCode === productCode);
}

export async function insertOrUpdateItem({ title, url, price, image, productCode }) {
  await db.read();
  db.data.items = db.data.items || [];
  const now = new Date().toISOString();

  let item = db.data.items.find((i) => i.productCode === productCode);
  if (item) {
    // Ensure priceHistory exists for legacy items
    if (!Array.isArray(item.priceHistory)) {
      item.priceHistory = [];
    }
    const lastPrice = item.priceHistory[item.priceHistory.length - 1]?.price;
    if (lastPrice !== price) {
      item.priceHistory.push({ price, date: now });
      item.price = price;
    }
  } else {
    db.data.items.push({
      title,
      url,
      price,
      image,
      productCode,
      created_at: now,
      priceHistory: [{ price, date: now }],
    });
  }
  await db.write();
} 