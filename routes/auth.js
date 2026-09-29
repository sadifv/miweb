require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2026';
const JWT_EXPIRES = '7d';

// Credenciales de administrador desde .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ============================================
// Middleware para verificar token JWT
// ============================================
function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// ============================================
// Generar token JWT
// ============================================
function generarToken(usuario) {
    return jwt.sign(
        {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol,
            nombre: usuario.nombre
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
}

// ============================================
// POST /api/auth/register - Registro de usuario
// ============================================
router.post('/register', async (req, res) => {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({
            error: 'Campos obligatorios faltantes',
            campos: ['nombre', 'apellido', 'email', 'password']
        });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ email: email.toLowerCase() });
        if (emailExistente) {
            return res.status(409).json({ error: 'Este email ya está registrado' });
        }

        // Crear nuevo usuario (el hook pre-save hashea la contraseña)
        const nuevoUsuario = new Usuario({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.toLowerCase().trim(),
            password,
            telefono: telefono || null,
            rol: 'cliente'
        });

        await nuevoUsuario.save();

        // Generar token
        const token = generarToken(nuevoUsuario);

        // Respuesta estructurada
        res.status(201).json({
            success: true,
            mensaje: 'Registro exitoso. ¡Bienvenido a TechStore!',
            token,
            usuario: nuevoUsuario.toPublicProfile()
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// POST /api/auth/login - Inicio de sesión
// ============================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email y contraseña son obligatorios'
        });
    }

    try {
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(403).json({ error: 'Cuenta desactivada. Contacta al soporte' });
        }

        // Verificar contraseña
        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Actualizar último acceso
        usuario.lastLogin = new Date();
        await usuario.save();

        // Generar token
        const token = generarToken(usuario);

        // Respuesta estructurada
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
});

// ============================================
// POST /api/auth/admin/login - Login de administrador
// ============================================
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        // Verificar credenciales de admin desde .env
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                { id: 'admin', email, rol: 'admin', nombre: 'Administrador' },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES }
            );

            return res.json({
                success: true,
                mensaje: 'Login de administrador exitoso',
                token,
                usuario: {
                    id: 'admin',
                    nombre: 'Administrador',
                    email,
                    rol: 'admin'
                }
            });
        }

        // Si no es admin, verificar en la base de datos
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
});

// ============================================
// GET /api/auth/me - Obtener usuario actual
// ============================================
router.get('/me', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            success: true,
            usuario: usuario.toPublicProfile()
        });

    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// PUT /api/auth/me - Actualizar perfil
// ============================================
router.put('/me', verificarToken, async (req, res) => {
    const { nombre, apellido, telefono, direcciones } = req.body;

    try {
        const usuario = await Usuario.findById(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar campos permitidos
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
});

// ============================================
// POST /api/auth/recuperar - Recuperación de contraseña
// ============================================
router.post('/recuperar', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            // Por seguridad, no revelamos si el email existe o no
            return res.json({
                success: true,
                mensaje: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
            });
        }

        // En producción: generar token de recuperación y enviar email
        // Por ahora, devolvemos mensaje genérico

        res.json({
            success: true,
            mensaje: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
        });

    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// POST /api/auth/logout - Cerrar sesión
// ============================================
router.post('/logout', (req, res) => {
    // El token se elimina del lado del cliente
    res.json({
        success: true,
        mensaje: 'Sesión cerrada correctamente'
    });
});

module.exports = router;
