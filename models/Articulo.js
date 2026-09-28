const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    dateDisplay: { type: String, required: true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Articulo', articuloSchema);
