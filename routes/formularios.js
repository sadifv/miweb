const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Formulario de contacto
router.post('/contacto', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Guardar en archivo JSON (simulación de base de datos)
    const dataPath = path.join(__dirname, '../data/contactos.json');
    let contactos = [];
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        contactos = JSON.parse(data);
    } catch {
        contactos = [];
    }

    contactos.push({
        id: Date.now(),
        nombre,
        email,
        mensaje,
        fecha: new Date().toISOString()
    });

    fs.writeFileSync(dataPath, JSON.stringify(contactos, null, 2));

    res.json({ mensaje: '¡Mensaje enviado! Te contactaremos pronto' });
});

// Formulario de newsletter
router.post('/newsletter', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El email es obligatorio' });
    }

    // Guardar en archivo JSON (simulación de base de datos)
    const dataPath = path.join(__dirname, '../data/newsletter.json');
    let suscriptores = [];
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        suscriptores = JSON.parse(data);
    } catch {
        suscriptores = [];
    }

    // Verificar si ya existe
    if (suscriptores.find(s => s.email === email)) {
        return res.status(400).json({ error: 'Este email ya está suscrito' });
    }

    suscriptores.push({
        id: Date.now(),
        email,
        fecha: new Date().toISOString()
    });

    fs.writeFileSync(dataPath, JSON.stringify(suscriptores, null, 2));

    res.json({ mensaje: '¡Suscripción exitosa! Revisa tu email' });
});

module.exports = router;
