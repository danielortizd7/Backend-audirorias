const { ValidationError } = require('../../../shared/errors/AppError');
const { ResponseHandler } = require('../../../shared/utils/responseHandler');

const registrarResultado = (req, res, next) => {
    try {
        const datos = req.body;
        
        if (!datos) {
            throw new ValidationError('Datos de resultado no proporcionados');
        }

        if (!datos.id_muestra) {
            throw new ValidationError('ID de muestra no proporcionado');
        }

        if (!datos.resultados || !Array.isArray(datos.resultados)) {
            throw new ValidationError('Resultados no proporcionados o formato inválido');
        }

        // Validar cada resultado
        datos.resultados.forEach((resultado, index) => {
            if (!resultado.parametro) {
                throw new ValidationError(`Parámetro no proporcionado en el resultado ${index + 1}`);
            }
            if (resultado.valor === undefined || resultado.valor === null) {
                throw new ValidationError(`Valor no proporcionado para el parámetro ${resultado.parametro}`);
            }
        });

        next();
    } catch (error) {
        return ResponseHandler.error(res, error);
    }
};

const editarResultado = (req, res, next) => {
    try {
        const datos = req.body;
        
        if (!datos) {
            throw new ValidationError('Datos de resultado no proporcionados');
        }

        if (!datos.id_muestra) {
            throw new ValidationError('ID de muestra no proporcionado');
        }

        if (!datos.resultados || !Array.isArray(datos.resultados)) {
            throw new ValidationError('Resultados no proporcionados o formato inválido');
        }

        // Validar cada resultado
        datos.resultados.forEach((resultado, index) => {
            if (!resultado.parametro) {
                throw new ValidationError(`Parámetro no proporcionado en el resultado ${index + 1}`);
            }
            if (resultado.valor === undefined || resultado.valor === null) {
                throw new ValidationError(`Valor no proporcionado para el parámetro ${resultado.parametro}`);
            }
        });

        next();
    } catch (error) {
        return ResponseHandler.error(res, error);
    }
};

module.exports = {
    registrarResultado,
    editarResultado
}; 