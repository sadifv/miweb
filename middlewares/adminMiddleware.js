const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'techstore_secret_key_2026';

function verificarAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = { verificarAdmin };
