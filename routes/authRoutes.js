const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/register', authController.registro);
router.post('/login', authController.login);
router.post('/admin/login', authController.loginAdmin);
router.get('/me', verificarToken, authController.obtenerUsuario);
router.put('/me', verificarToken, authController.actualizarPerfil);
router.post('/recuperar', authController.recuperarContraseña);
router.post('/logout', authController.logout);

module.exports = router;
