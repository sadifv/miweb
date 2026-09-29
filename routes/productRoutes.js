const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verificarAdmin } = require('../middlewares/adminMiddleware');

router.get('/', productController.obtenerProductos);
router.get('/:id', productController.obtenerProducto);
router.post('/', verificarAdmin, productController.crearProducto);
router.put('/:id', verificarAdmin, productController.actualizarProducto);
router.delete('/:id', verificarAdmin, productController.eliminarProducto);

module.exports = router;
