const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
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
  unit: {
    type: String,
    required: true
  }
});

const nomenclatureSchema = new mongoose.Schema({
  parentProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  components: [componentSchema],
  version: {
    type: String,
    required: true
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Nomenclature', nomenclatureSchema);