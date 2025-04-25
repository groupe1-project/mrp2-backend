const Nomenclature = require('../models/Nomenclature');
const Product = require('../models/Product');

const populateOptions = [
  { path: 'parentProduct', select: 'name reference' },
  { path: 'components.product', select: 'name reference unit' }
];

// Créer une nomenclature
exports.create = async (req, res) => {
    console.log('Requête reçue:', req.body); // Debug back 1
    
    try {
      const { parentProduct, components, version } = req.body;
  
      // Validation renforcée
      if (!parentProduct || !components || !version) {
        console.log('Validation failed - Missing fields'); // Debug back 2
        return res.status(400).json({ 
          success: false,
          message: 'Tous les champs sont requis'
        });
      }
  
      const nomenclature = await Nomenclature.create(req.body);
      console.log('Nomenclature créée:', nomenclature); // Debug back 3
  
      res.status(201).json({
        success: true,
        data: nomenclature
      });
    } catch (error) {
      console.error('Erreur serveur:', error); // Debug back 4
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

// Récupérer toutes les nomenclatures
exports.getAll = async (req, res) => {
  try {
    const nomenclatures = await Nomenclature.find()
      .populate(populateOptions)
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: nomenclatures.length,
      data: nomenclatures
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Autres méthodes (getById, update, delete)...