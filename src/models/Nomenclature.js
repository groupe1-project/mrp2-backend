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
    min: 0.01
  },
  unit: {
    type: String,
    default: 'pcs'
  }
}, { _id: false });

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
    required: true,
    default: '1.0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index pour améliorer les performances
nomenclatureSchema.index({ parentProduct: 1 });
nomenclatureSchema.index({ 'components.product': 1 });

module.exports = mongoose.model('Nomenclature', nomenclatureSchema);