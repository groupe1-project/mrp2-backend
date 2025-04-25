const Stock = require('../models/Stock');
const Product = require('../models/Product');

// Gestion des mouvements de stock
exports.createStockMovement = async (req, res) => {
  try {
    const { productId, quantity, type, reference } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    let stock = await Stock.findOne({ product: productId });
    
    if (!stock) {
      stock = new Stock({ product: productId, quantity: 0 });
    }

    // Mise à jour du stock selon le type de mouvement
    if (type === 'in') {
      stock.quantity += quantity;
    } else if (type === 'out') {
      if (stock.quantity < quantity) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      stock.quantity -= quantity;
    } else if (type === 'adjustment') {
      stock.quantity = quantity;
    }

    // Ajout du mouvement à l'historique
    stock.movements.push({
      quantity,
      type,
      reference
    });

    await stock.save();
    
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calcul des besoins nets (MRP)
exports.calculateNetRequirements = async (req, res) => {
  try {
    const { productId, requiredQuantity, date } = req.body;
    
    // Implémentation de la logique MRP
    // 1. Récupérer la nomenclature du produit
    // 2. Calculer les besoins bruts
    // 3. Prendre en compte le stock disponible
    // 4. Calculer les besoins nets
    // 5. Planifier les ordres de fabrication/approvisionnement
    
    // Ceci est une version simplifiée
    const product = await Product.findById(productId).populate('nomenclature');
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const stock = await Stock.findOne({ product: productId });
    const availableStock = stock ? stock.quantity : 0;

    const netRequirements = Math.max(0, requiredQuantity - availableStock);

    res.json({
      product: product.name,
      requiredQuantity,
      availableStock,
      netRequirements,
      plannedOrders: netRequirements > 0 ? [
        {
          quantity: netRequirements,
          suggestedDate: new Date(date),
          type: product.isManufactured ? 'production' : 'purchase'
        }
      ] : []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};