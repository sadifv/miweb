const express = require('express');
const router = express.Router();

// Endpoint de login para administrador
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        res.json({ 
            success: true, 
            mensaje: 'Login exitoso',
            token: 'admin_token_' + Date.now()
        });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// Endpoint de logout
router.post('/logout', (req, res) => {
    res.json({ success: true, mensaje: 'Logout exitoso' });
});

module.exports = router;
