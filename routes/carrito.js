const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

// Cupones válidos
const CUPONES = {
    'BIENVENIDA10': 0.10,
    'TECH20': 0.20,
    'ENVIOGRATIS': 0.00
};

// Obtener carrito
router.get('/', async (req, res) => {
    try {
        const sessionId = req.query.sessionId;
        if (!sessionId) {
            return res.status(400).json({ error: 'SessionId es requerido' });
        }

        let carrito = await Carrito.findOne({ sessionId });
        if (!carrito) {
            carrito = new Carrito({ sessionId, items: [] });
            await carrito.save();
        }

        // Obtener datos completos de productos
        const itemsConDatos = await Promise.all(carrito.items.map(async (item) => {
            const producto = await Producto.findOne({ id: item.productoId });
            return {
                ...item.toObject(),
                producto: producto ? {
                    id: producto.id,
                    name: producto.name,
                    price: producto.price,
                    image: producto.image
                } : null
            };
        }));

        const subtotal = itemsConDatos.reduce((sum, item) => {
            return sum + (item.producto ? item.producto.price * item.cantidad : 0);
        }, 0);

        const total = subtotal - carrito.descuento;

        res.json({
            items: itemsConDatos,
            subtotal,
            descuento: carrito.descuento,
            cupon: carrito.cupon,
            envio: 0,
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
    try {
        const { sessionId, productoId, cantidad } = req.body;

        if (!sessionId || !productoId) {
            return res.status(400).json({ error: 'SessionId y productoId son requeridos' });
        }

        let carrito = await Carrito.findOne({ sessionId });
        if (!carrito) {
            carrito = new Carrito({ sessionId, items: [] });
        }

        const itemExistente = carrito.items.find(item => item.productoId === productoId);
        if (itemExistente) {
            itemExistente.cantidad += cantidad || 1;
        } else {
            carrito.items.push({ productoId, cantidad: cantidad || 1 });
        }

        await carrito.save();
        res.json({ mensaje: 'Producto agregado al carrito', carrito });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar al carrito' });
    }
});

// Actualizar cantidad
router.put('/actualizar', async (req, res) => {
    try {
        const { sessionId, productoId, cantidad } = req.body;

        if (!sessionId || !productoId) {
            return res.status(400).json({ error: 'SessionId y productoId son requeridos' });
        }

        const carrito = await Carrito.findOne({ sessionId });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const item = carrito.items.find(item => item.productoId === productoId);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            await carrito.save();
        }

        res.json({ mensaje: 'Cantidad actualizada', carrito });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
});

// Eliminar producto del carrito
router.delete('/eliminar/:productoId', async (req, res) => {
    try {
        const { sessionId } = req.query;
        const productoId = parseInt(req.params.productoId);

        if (!sessionId) {
            return res.status(400).json({ error: 'SessionId es requerido' });
        }

        const carrito = await Carrito.findOne({ sessionId });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.items = carrito.items.filter(item => item.productoId !== productoId);
        await carrito.save();

        res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
});

// Aplicar cupón
router.post('/cupon', async (req, res) => {
    try {
        const { sessionId, cupon } = req.body;

        if (!sessionId || !cupon) {
            return res.status(400).json({ error: 'SessionId y cupon son requeridos' });
        }

        const carrito = await Carrito.findOne({ sessionId });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (CUPONES[cupon]) {
            // Calcular subtotal
            const itemsConDatos = await Promise.all(carrito.items.map(async (item) => {
                const producto = await Producto.findOne({ id: item.productoId });
                return producto ? producto.price * item.cantidad : 0;
            }));
            const subtotal = itemsConDatos.reduce((sum, price) => sum + price, 0);

            carrito.cupon = cupon;
            carrito.descuento = subtotal * CUPONES[cupon];
            await carrito.save();

            res.json({ mensaje: `Cupón ${cupon} aplicado`, descuento: carrito.descuento });
        } else {
            res.status(400).json({ error: 'Cupón inválido' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al aplicar cupón' });
    }
});

// Vaciar carrito
router.delete('/vaciar', async (req, res) => {
    try {
        const sessionId = req.query.sessionId || req.body?.sessionId;

        if (!sessionId) {
            return res.status(400).json({ error: 'SessionId es requerido' });
        }

        const carrito = await Carrito.findOne({ sessionId });
        if (carrito) {
            carrito.items = [];
            carrito.cupon = null;
            carrito.descuento = 0;
            await carrito.save();
        }

        res.json({ mensaje: 'Carrito vaciado' });
    } catch (error) {
        console.error('Error vaciando carrito:', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

module.exports = router;
