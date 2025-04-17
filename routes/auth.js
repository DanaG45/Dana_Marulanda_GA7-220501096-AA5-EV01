// Importa los módulos necesarios
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); // Modelo de usuario
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas

// ==================== REGISTRO DE USUARIO ====================
router.post('/register', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        // Verifica si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ nombre_usuario });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'Usuario ya existe' });
        }

        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crea un nuevo usuario con la contraseña encriptada
        const nuevoUsuario = new Usuario({ nombre_usuario, contrasena: hashedPassword });

        // Guarda el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        // Respuesta de éxito
        res.json({ success: true, message: 'Usuario registrado correctamente' });
    } catch (error) {
        // Manejo de errores del servidor
        console.error('🔥 Error en registro:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// ==================== INICIO DE SESIÓN ====================
router.post('/login', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        console.log('Intentando login con:', nombre_usuario);

        // Busca al usuario en la base de datos
        const usuario = await Usuario.findOne({ nombre_usuario });
        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Compara la contraseña ingresada con la almacenada
        const valida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valida) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Guarda la sesión del usuario
        req.session.user = usuario;

        // Respuesta de éxito
        res.json({ success: true });
    } catch (error) {
        // Manejo de errores del servidor
        console.error('🔥 Error en login:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// Exporta las rutas definidas para ser usadas en el servidor principal
module.exports = router;
