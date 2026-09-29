require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Contacto = require('../models/Contacto');
const Newsletter = require('../models/Newsletter');

const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2026';

// ============================================
// Middleware de autenticación admin
// ============================================
function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// ============================================
// Métricas / KPIs
// ============================================
router.get('/metricas', verificarAdmin, async (req, res) => {
    try {
        const totalClientes = await Usuario.countDocuments({ rol: 'cliente' });
        const totalProductos = await Producto.countDocuments();
        const totalPedidos = await Pedido.countDocuments();
        const totalVentas = await Pedido.aggregate([
            { $match: { estado: { $ne: 'cancelado' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const productosBajoStock = await Producto.countDocuments({ stock: { $lt: 10 } });
        const pedidosPendientes = await Pedido.countDocuments({ estado: 'pendiente' });
        const pedidosEnviados = await Pedido.countDocuments({ estado: 'enviado' });
        const pedidosEntregados = await Pedido.countDocuments({ estado: 'entregado' });

        res.json({
            totalClientes,
            totalProductos,
            totalPedidos,
            totalVentas: totalVentas[0]?.total || 0,
            productosBajoStock,
            pedidosPendientes,
            pedidosEnviados,
            pedidosEntregados
        });
    } catch (error) {
        console.error('Error obteniendo métricas:', error);
        res.status(500).json({ error: 'Error al obtener métricas' });
    }
});

// ============================================
// Usuarios
// ============================================
router.get('/usuarios', verificarAdmin, async (req, res) => {
    try {
        const usuarios = await Usuario.find({ rol: 'cliente' }).select('-password').sort({ createdAt: -1 });
        res.json(usuarios);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

router.put('/usuarios/:id', verificarAdmin, async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, activo } = req.body;
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (nombre) usuario.nombre = nombre;
        if (apellido) usuario.apellido = apellido;
        if (email) usuario.email = email;
        if (telefono !== undefined) usuario.telefono = telefono;
        if (activo !== undefined) usuario.activo = activo;

        await usuario.save();

        res.json({
            success: true,
            mensaje: 'Usuario actualizado',
            usuario: usuario.toPublicProfile()
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// ============================================
// Productos
// ============================================
router.get('/productos', verificarAdmin, async (req, res) => {
    try {
        const productos = await Producto.find().sort({ id: 1 });
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.post('/productos', verificarAdmin, async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({
            success: true,
            mensaje: 'Producto creado',
            producto: nuevoProducto
        });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

router.put('/productos/:id', verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({
            success: true,
            mensaje: 'Producto actualizado',
            producto
        });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/productos/:id', verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findOneAndDelete({ id: parseInt(req.params.id) });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ success: true, mensaje: 'Producto eliminado' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// ============================================
// Pedidos
// ============================================
router.get('/pedidos', verificarAdmin, async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fechaPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

router.put('/pedidos/:id/estado', verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        const pedido = await Pedido.findById(req.params.id);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        pedido.estado = estado;

        if (estado === 'enviado' && !pedido.fechaEnvio) {
            pedido.fechaEnvio = new Date();
        }

        if (estado === 'entregado' && !pedido.fechaEntrega) {
            pedido.fechaEntrega = new Date();
        }

        await pedido.save();

        res.json({
            success: true,
            mensaje: 'Estado actualizado',
            pedido
        });
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        res.status(500).json({ error: 'Error al actualizar pedido' });
    }
});

// ============================================
// Contactos y Newsletter
// ============================================
router.get('/contactos', verificarAdmin, async (req, res) => {
    try {
        const contactos = await Contacto.find().sort({ fecha: -1 });
        res.json(contactos);
    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});

router.get('/newsletter', verificarAdmin, async (req, res) => {
    try {
        const suscriptores = await Newsletter.find().sort({ fecha: -1 });
        res.json(suscriptores);
    } catch (error) {
        console.error('Error obteniendo suscriptores:', error);
        res.status(500).json({ error: 'Error al obtener suscriptores' });
    }
});

module.exports = router;
