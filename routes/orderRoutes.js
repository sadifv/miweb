const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verificarAdmin } = require('../middlewares/adminMiddleware');

router.get('/', verificarAdmin, orderController.obtenerPedidos);
router.put('/:id/estado', verificarAdmin, orderController.actualizarEstadoPedido);

module.exports = router;
