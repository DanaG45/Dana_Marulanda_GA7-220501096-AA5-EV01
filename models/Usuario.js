// Importa el módulo mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Define el esquema del modelo de usuario
const UsuarioSchema = new mongoose.Schema({
    // Campo para el nombre de usuario: obligatorio y único
    nombre_usuario: { type: String, required: true, unique: true },
    // Campo para la contraseña: obligatorio
    contrasena: { type: String, required: true }
});

// Exporta el modelo 'Usuario' basado en el esquema definido
module.exports = mongoose.model('Usuario', UsuarioSchema);
