const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Endpoint GET /
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
