const express = require('express');
const router = express.Router();
const Contacto = require('../models/Contacto');
const Newsletter = require('../models/Newsletter');

// Formulario de contacto
router.post('/contacto', async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const contacto = new Contacto({ nombre, email, mensaje });
        await contacto.save();
        res.json({ mensaje: '¡Mensaje enviado! Te contactaremos pronto' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});

// Formulario de newsletter
router.post('/newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    try {
        const existente = await Newsletter.findOne({ email });
        if (existente) {
            return res.status(400).json({ error: 'Este email ya está suscrito' });
        }

        const suscriptor = new Newsletter({ email });
        await suscriptor.save();
        res.json({ mensaje: '¡Suscripción exitosa! Revisa tu email' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la suscripción' });
    }
});

module.exports = router;
