const mongoose = require('mongoose');

const pedidoItemSchema = new mongoose.Schema({
    productoId: { type: Number, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    imagen: { type: String }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioNombre: { type: String, required: true },
    usuarioEmail: { type: String, required: true },
    items: [pedidoItemSchema],
    subtotal: { type: Number, required: true },
    envio: { type: Number, default: 0 },
    descuento: { type: Number, default: 0 },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    direccionEnvio: {
        calle: String,
        ciudad: String,
        estado: String,
        codigoPostal: String,
        pais: String
    },
    metodoPago: { type: String, default: 'tarjeta' },
    fechaPedido: { type: Date, default: Date.now },
    fechaEnvio: { type: Date },
    fechaEntrega: { type: Date },
    notas: { type: String }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
