const express = require('express');
const cors = require('cors');
const errorHandler = require('../shared/middleware/errorHandler');
const { NotFoundError } = require('../shared/errors/AppError');
const { registrarAccion } = require('../shared/middleware/auditoriaMiddleware');

// Importar rutas
const muestrasRoutes = require('../app/registro-muestras/routes/muestrasRoutes');
const registroMuestrasRoutes = require('../app/registro-muestras/routes/registroMuestrasRoutes');
const resultadosRoutes = require('../app/ingreso-resultados/routes/resultadosRoutes');
const auditoriaRoutes = require('../app/auditoria/routes/auditoriaRoutes');

// Crear aplicación Express
const createApp = () => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Middleware de auditoría
    app.use(registrarAccion);

    // Rutas
    app.use('/api/muestras', muestrasRoutes);
    app.use('/api/registro-muestras', registroMuestrasRoutes);
    app.use('/api/resultados', resultadosRoutes);
    app.use('/api/auditoria', auditoriaRoutes);

    // Ruta de prueba
    app.get('/', (req, res) => {
        res.json({ message: 'API de Registro de Muestras funcionando' });
    });

    // Manejo de rutas no encontradas
    app.use((req, res, next) => {
        next(new NotFoundError(`Ruta no encontrada: ${req.originalUrl}`));
    });

    // Middleware de manejo de errores
    app.use(errorHandler);

    return app;
};

module.exports = createApp; 