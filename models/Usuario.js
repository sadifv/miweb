const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
    telefono: { type: String },
    direcciones: [{
        alias: { type: String, required: true },
        calle: { type: String, required: true },
        ciudad: { type: String, required: true },
        estado: { type: String, required: true },
        codigoPostal: { type: String, required: true },
        pais: { type: String, default: 'Ecuador' },
        esPredeterminada: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    activo: { type: Boolean, default: true }
});

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

usuarioSchema.methods.compararPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

usuarioSchema.methods.toPublicProfile = function() {
    return {
        id: this._id,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        rol: this.rol,
        telefono: this.telefono,
        direcciones: this.direcciones,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

module.exports = mongoose.model('Usuario', usuarioSchema);
