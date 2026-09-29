const express = require('express');
const router = express.Router();
const Articulo = require('../models/Articulo');

// Obtener todos los artículos
router.get('/', async (req, res) => {
    try {
        const articulos = await Articulo.find().sort({ id: 1 });
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los artículos' });
    }
});

// Obtener artículo por ID
router.get('/:id', async (req, res) => {
    try {
        const articulo = await Articulo.findOne({ id: parseInt(req.params.id) });
        if (!articulo) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        res.json(articulo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el artículo' });
    }
});

// Crear nuevo artículo
router.post('/', async (req, res) => {
    try {
        const nuevoArticulo = new Articulo(req.body);
        await nuevoArticulo.save();
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el artículo' });
    }
});

// Actualizar artículo
router.put('/:id', async (req, res) => {
    try {
        const articulo = await Articulo.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (!articulo) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        res.json(articulo);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el artículo' });
    }
});

// Eliminar artículo
router.delete('/:id', async (req, res) => {
    try {
        const articulo = await Articulo.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!articulo) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        res.json({ mensaje: 'Artículo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el artículo' });
    }
});

module.exports = router;
