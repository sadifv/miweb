const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Obtener todos los productos
router.get('/', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/productos.json'), 'utf8');
        const productos = JSON.parse(data);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los productos' });
    }
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/productos.json'), 'utf8');
        const productos = JSON.parse(data);
        const producto = productos.find(p => p.id === parseInt(req.params.id));
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el producto' });
    }
});

module.exports = router;
