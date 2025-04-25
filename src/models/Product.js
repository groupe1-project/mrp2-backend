const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  unit: {
    type: String,
    default: 'pcs'
  },
  type: {
    type: String,
    enum: ['raw', 'finished', 'component'],
    required: true
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);