const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/movements', controller.createMovement);

module.exports = router;