const Stock = require('../models/Stock');
const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate('product')
      .populate('movements.user');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMovement = async (req, res) => {
  try {
    const { productId, quantity, type, reference } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let stock = await Stock.findOne({ product: productId });
    if (!stock) {
      stock = new Stock({ product: productId, quantity: 0 });
    }

    if (type === 'in') stock.quantity += quantity;
    else if (type === 'out') stock.quantity = Math.max(0, stock.quantity - quantity);

    stock.movements.push({
      type,
      quantity,
      reference,
      user: req.user.id
    });

    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};