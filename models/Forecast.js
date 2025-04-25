const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  forecastQuantity: {
    type: Number,
    required: true
  },
  actualQuantity: Number,
  method: {
    type: String,
    enum: ['moving_average', 'exponential_smoothing', 'regression', 'manual'],
    required: true
  },
  confidenceInterval: {
    lower: Number,
    upper: Number
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Forecast', forecastSchema);