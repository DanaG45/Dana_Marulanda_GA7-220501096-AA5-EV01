const express = require('express'); // Importa el framework Express
const mongoose = require('mongoose'); // Importa Mongoose para trabajar con MongoDB
const session = require('express-session'); // Importa el middleware de sesiones
const bodyParser = require('body-parser'); // Importa el middleware para parsear cuerpos de solicitudes HTTP
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const path = require('path'); // Importa el módulo para manejar rutas de archivos

const app = express(); // Crea una nueva instancia de Express

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/servitec', {
    useNewUrlParser: true, // Usar el nuevo analizador de URL de MongoDB
    useUnifiedTopology: true // Usar el nuevo motor de conexión de MongoDB
}).then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => console.error("❌ Error en MongoDB", err));

// Middleware
app.use(bodyParser.json()); // Analiza las solicitudes con cuerpo JSON
app.use(bodyParser.urlencoded({ extended: true })); // Analiza los cuerpos con codificación de URL
app.use(session({
    secret: 'mi_clave_secreta', // Clave secreta para las sesiones
    resave: false, // No resguardar la sesión si no ha cambiado
    saveUninitialized: true // Guarda las sesiones que no están inicializadas
}));

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'

// Ruta raíz
app.get('/', (req, res) => {
    if (req.session.user) { // Si el usuario está autenticado
        res.redirect('/Principal.html'); // Redirige al usuario a la página principal
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html')); // Si no, muestra la página de inicio de sesión
    }
});

// Captura de errores
app.use((err, req, res, next) => {
    console.error('🛑 Middleware Error:', err.stack); // Muestra el error en consola
    res.status(500).send('Algo salió mal!'); // Responde con un error 500
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000'); // Muestra un mensaje cuando el servidor está corriendo
});
