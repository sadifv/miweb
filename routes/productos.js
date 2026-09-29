const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ id: 1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findOne({ id: parseInt(req.params.id) });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' });
    }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
