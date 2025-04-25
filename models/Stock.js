const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  safetyStock: {
    type: Number,
    default: 0
  },
  reorderPoint: {
    type: Number,
    default: 0
  },
  lastInventoryDate: {
    type: Date
  },
  movements: [{
    date: { type: Date, default: Date.now },
    quantity: Number,
    type: { type: String, enum: ['in', 'out', 'adjustment'] },
    reference: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);