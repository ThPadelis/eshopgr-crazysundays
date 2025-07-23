import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  price: { type: String, required: true },
  date: { type: Date, required: true },
}, { _id: false });

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  productCode: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  priceHistory: { type: [priceHistorySchema], default: [] },
  category: { type: String },
});

const Item = mongoose.model('Item', itemSchema);

export default Item; 