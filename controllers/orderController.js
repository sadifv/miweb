const Pedido = require('../models/Pedido');

async function obtenerPedidos(req, res) {
    try {
        const pedidos = await Pedido.find().sort({ fechaPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
}

async function actualizarEstadoPedido(req, res) {
    const { estado } = req.body;

    try {
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

        res.json({ success: true, mensaje: 'Estado actualizado', pedido });
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        res.status(500).json({ error: 'Error al actualizar pedido' });
    }
}

module.exports = {
    obtenerPedidos,
    actualizarEstadoPedido
};
