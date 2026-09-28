const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: { type: String, required: true },
    oldPrice: { type: Number, default: null },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stars: { type: String, required: true },
    starsLabel: { type: String, required: true },
    reviews: { type: String, required: true },
    badge: { type: String, required: true }
});

module.exports = mongoose.model('Producto', productoSchema);
