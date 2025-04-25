const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['in', 'out', 'adjustment'], required: true },
  quantity: { type: Number, required: true },
  reference: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const stockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  minStock: Number,
  location: String,
  movements: [movementSchema]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);