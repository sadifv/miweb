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

module.exports = router;
