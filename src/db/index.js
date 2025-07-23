import Item from './item.model.js';

export async function insertItem({ title, url, price, image, productCode, category }) {
  const item = new Item({
    title,
    url,
    price,
    image,
    productCode,
    category,
    created_at: new Date(),
    priceHistory: [{ price, date: new Date() }],
  });
  await item.save();
}

export async function getAllItems() {
  return Item.find().sort({ created_at: -1 });
}

export async function findItemByTitle(title) {
  return Item.findOne({ title });
}

export async function findItemByProductCode(productCode) {
  return Item.findOne({ productCode });
}

export async function insertOrUpdateItem({ title, url, price, image, productCode, category }) {
  const now = new Date();
  let item = await Item.findOne({ productCode });
  if (item) {
    // For backward compatibility: ensure priceHistory exists for legacy items
    if (!Array.isArray(item.priceHistory)) {
      item.priceHistory = [];
    }
    const lastPrice = item.priceHistory.length > 0 ? item.priceHistory[item.priceHistory.length - 1].price : undefined;
    if (lastPrice !== price) {
      item.priceHistory.push({ price, date: now });
      item.price = price;
    }
    if (category) {
      item.category = category;
    }
    await item.save();
  } else {
    item = new Item({
      title,
      url,
      price,
      image,
      productCode,
      created_at: now,
      priceHistory: [{ price, date: now }],
      category,
    });
    await item.save();
  }
} 