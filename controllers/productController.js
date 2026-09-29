const Producto = require('../models/Producto');

async function obtenerProductos(req, res) {
    try {
        const productos = await Producto.find().sort({ id: 1 });
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

async function obtenerProducto(req, res) {
    try {
        const producto = await Producto.findOne({ id: parseInt(req.params.id) });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
}

async function crearProducto(req, res) {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({ success: true, mensaje: 'Producto creado', producto: nuevoProducto });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
}

async function actualizarProducto(req, res) {
    try {
        const producto = await Producto.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ success: true, mensaje: 'Producto actualizado', producto });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
}

async function eliminarProducto(req, res) {
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
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
