require('dotenv').config();
const express = require('express');
const morgan = require('morgan'); // Agrega esta línea
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');
const orderRoutes = require('./interfaces/routes/orderRoutes');
const { probarConexion } = require('./infrastructure/database/db');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging con morgan
app.use(morgan('dev')); // Agrega esta línea

// Rutas de la API
app.use('/', orderRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Función para iniciar el servidor
async function iniciarServidor() {
  try {
    // Probar la conexión a la base de datos
    //await probarConexion();

    // Iniciar el servidor si la conexión es exitosa
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor debido a un error en la conexión a la base de datos.');
    process.exit(1); // Finaliza el proceso con un código de error
  }
}

// Llamar a la función para iniciar el servidor
iniciarServidor();
