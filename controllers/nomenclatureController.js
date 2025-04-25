const Nomenclature = require('../models/Nomenclature');
const Product = require('../models/Product');

// Créer ou mettre à jour une nomenclature
exports.updateNomenclature = async (req, res) => {
  try {
    const { parentProductId, components, version } = req.body;

    const parentProduct = await Product.findById(parentProductId);
    if (!parentProduct) {
      return res.status(404).json({ message: 'Produit parent non trouvé' });
    }

    // Vérifier que tous les composants existent
    for (const component of components) {
      const product = await Product.findById(component.product);
      if (!product) {
        return res.status(404).json({ message: `Composant ${component.product} non trouvé` });
      }
    }

    let nomenclature = await Nomenclature.findOne({ parentProduct: parentProductId });

    if (nomenclature) {
      // Mise à jour
      nomenclature.components = components;
      nomenclature.version = version;
      nomenclature.effectiveDate = new Date();
    } else {
      // Création
      nomenclature = new Nomenclature({
        parentProduct: parentProductId,
        components,
        version
      });
    }

    await nomenclature.save();

    // Mettre à jour le produit parent
    parentProduct.hasNomenclature = true;
    await parentProduct.save();

    res.status(201).json(nomenclature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Explosion des besoins
exports.explodeRequirements = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const result = await this.calculateRequirements(productId, quantity);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction récursive pour calculer les besoins
exports.calculateRequirements = async (productId, quantity, level = 0, result = {}) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error(`Produit ${productId} non trouvé`);

  const nomenclature = await Nomenclature.findOne({ parentProduct: productId });
  const stock = await Stock.findOne({ product: productId });
  const availableStock = stock ? stock.quantity : 0;

  const netRequirements = Math.max(0, quantity - availableStock);

  if (!result[productId]) {
    result[productId] = {
      product: product.name,
      level,
      quantity,
      availableStock,
      netRequirements,
      components: []
    };
  } else {
    result[productId].quantity += quantity;
    result[productId].netRequirements = Math.max(0, result[productId].quantity - availableStock);
  }

  if (nomenclature && netRequirements > 0) {
    for (const component of nomenclature.components) {
      const componentQuantity = component.quantity * netRequirements;
      await this.calculateRequirements(
        component.product,
        componentQuantity,
        level + 1,
        result
      );
      
      result[productId].components.push({
        productId: component.product,
        quantity: componentQuantity,
        unit: component.unit
      });
    }
  }

  return result;
};