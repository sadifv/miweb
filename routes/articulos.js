const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Obtener todos los artículos
router.get('/', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/articulos.json'), 'utf8');
        const articulos = JSON.parse(data);
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los artículos' });
    }
});

// Obtener artículo por ID
router.get('/:id', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/articulos.json'), 'utf8');
        const articulos = JSON.parse(data);
        const articulo = articulos.find(a => a.id === parseInt(req.params.id));
        if (!articulo) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        res.json(articulo);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el artículo' });
    }
});

module.exports = router;
