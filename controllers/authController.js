const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2026';

function generarToken(usuario) {
    return jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

async function registro(req, res) {
    const { nombre, apellido, email, password, telefono } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes', campos: ['nombre', 'apellido', 'email', 'password'] });
    }

    try {
        const emailExistente = await Usuario.findOne({ email: email.toLowerCase() });
        if (emailExistente) {
            return res.status(409).json({ error: 'Este email ya está registrado' });
        }

        const nuevoUsuario = new Usuario({ nombre, apellido, email, password, telefono });
        await nuevoUsuario.save();

        const token = generarToken(nuevoUsuario);

        res.status(201).json({
            success: true,
            mensaje: 'Registro exitoso',
            token,
            usuario: nuevoUsuario.toPublicProfile()
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return res.status(403).json({ error: 'Cuenta desactivada' });
        }

        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        usuario.lastLogin = new Date();
        await usuario.save();

        const token = generarToken(usuario);

        res.json({
            success: true,
            mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}!`,
            token,
            usuario: usuario.toPublicProfile()
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function loginAdmin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { id: 'admin', email, rol: 'admin', nombre: 'Administrador' },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                success: true,
                mensaje: 'Login de administrador exitoso',
                token,
                usuario: { id: 'admin', nombre: 'Administrador', email, rol: 'admin' }
            });
        }

        const usuario = await Usuario.findOne({ email: email.toLowerCase(), rol: 'admin' });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales de administrador inválidas' });
        }

        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales de administrador inválidas' });
        }

        usuario.lastLogin = new Date();
        await usuario.save();

        const token = generarToken(usuario);

        res.json({
            success: true,
            mensaje: 'Login de administrador exitoso',
            token,
            usuario: usuario.toPublicProfile()
        });
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function obtenerUsuario(req, res) {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, usuario: usuario.toPublicProfile() });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function actualizarPerfil(req, res) {
    const { nombre, apellido, telefono, direcciones } = req.body;

    try {
        const usuario = await Usuario.findById(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (nombre) usuario.nombre = nombre.trim();
        if (apellido) usuario.apellido = apellido.trim();
        if (telefono !== undefined) usuario.telefono = telefono;
        if (direcciones) usuario.direcciones = direcciones;

        await usuario.save();

        res.json({
            success: true,
            mensaje: 'Perfil actualizado correctamente',
            usuario: usuario.toPublicProfile()
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function recuperarContraseña(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.json({ success: true, mensaje: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
        }

        res.json({ success: true, mensaje: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' });
    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

function logout(req, res) {
    res.json({ success: true, mensaje: 'Sesión cerrada correctamente' });
}

module.exports = {
    registro,
    login,
    loginAdmin,
    obtenerUsuario,
    actualizarPerfil,
    recuperarContraseña,
    logout
};
