const mongoose = require('mongoose');

const carritoItemSchema = new mongoose.Schema({
    productoId: { type: Number, required: true },
    cantidad: { type: Number, required: true, default: 1, min: 1 }
}, { _id: false });

const carritoSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    items: [carritoItemSchema],
    cupon: { type: String, default: null },
    descuento: { type: Number, default: 0 },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrito', carritoSchema);
