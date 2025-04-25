const express = require('express');
const router = express.Router();
const controller = require('../controllers/nomenclatureController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { check } = require('express-validator');

router.use(authMiddleware);

// Validation rules
const createRules = [
  check('parentProduct').isMongoId(),
  check('components').isArray({ min: 1 }),
  check('components.*.product').isMongoId(),
  check('components.*.quantity').isFloat({ min: 0.01 })
];

router.post('/', validate(createRules), controller.create);
router.get('/', controller.getAll);
// Ajouter ici: getById, update, delete...

module.exports = router;