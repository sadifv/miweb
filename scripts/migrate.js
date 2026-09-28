require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Migrar productos
        const productosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/productos.json'), 'utf8'));
        const Producto = require('../models/Producto');
        await Producto.deleteMany({});
        await Producto.insertMany(productosData);
        console.log(`Productos migrados: ${productosData.length}`);

        // Migrar artículos
        const articulosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/articulos.json'), 'utf8'));
        const Articulo = require('../models/Articulo');
        await Articulo.deleteMany({});
        await Articulo.insertMany(articulosData);
        console.log(`Artículos migrados: ${articulosData.length}`);

        console.log('Migración completada');
        process.exit(0);
    } catch (error) {
        console.error('Error en migración:', error);
        process.exit(1);
    }
}

migrate();
