const { verificarRolUsuario, validarUsuario } = require('../../app/registro-muestras/services/usuariosService');
const { ResponseHandler } = require('../utils/responseHandler');
const { AuthenticationError, AuthorizationError } = require('../errors/AppError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ROLES, PERMISOS, ROLES_PERMISOS } = require('../config/rolesConfig');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login recibido:', { email });

        const usuario = await validarUsuario(email, password);
        
        if (!usuario) {
            return ResponseHandler.error(res, new AuthenticationError('Credenciales inválidas'));
        }

        return ResponseHandler.success(res, {
            token: usuario.token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
                documento: usuario.documento,
                permisos: usuario.permisos
            }
        }, 'Login exitoso');
    } catch (error) {
        console.error('Error en login:', error);
        return ResponseHandler.error(res, error);
    }
};

const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return ResponseHandler.error(res, new AuthenticationError('Token no proporcionado'));
        }

        // Decodificar el token (sin verificar firma ya que viene del servicio de usuarios)
        const decoded = jwt.decode(token);
        if (!decoded) {
            return ResponseHandler.error(res, new AuthenticationError('Token inválido'));
        }

        // Verificar la expiración
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return ResponseHandler.error(res, new AuthenticationError('Token expirado'));
        }

        // Verificar que el usuario existe y tiene el rol correcto
        const usuarioValido = await verificarRolUsuario(decoded.userId, decoded.rol);
        if (!usuarioValido) {
            return ResponseHandler.error(res, new AuthenticationError('Usuario no autorizado'));
        }

        // Asignar la información del usuario al request
        req.usuario = {
            id: decoded.userId,
            documento: decoded.documento || '',
            rol: decoded.rol,
            permisos: decoded.permisos || []
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return ResponseHandler.error(res, new AuthenticationError('Error de autenticación'));
    }
};

const verificarDocumento = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new AuthenticationError('Token no proporcionado');
        }

        // Decodificar el token (sin verificar firma)
        const decoded = jwt.decode(token);
        if (!decoded) {
            throw new AuthenticationError('Token inválido');
        }

        // Verificar la expiración
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            throw new AuthenticationError('Token expirado');
        }

        // Verificar que el rol sea válido
        if (!Object.values(ROLES).includes(decoded.rol)) {
            throw new AuthenticationError('Rol de usuario inválido');
        }

        // Verificar que el usuario existe y tiene el rol correcto
        const usuarioValido = await verificarRolUsuario(decoded.userId, decoded.rol);
        if (!usuarioValido) {
            throw new AuthenticationError('Usuario no autorizado');
        }

        // Asignar la información del usuario al request
        req.usuario = {
            id: decoded.userId,
            documento: decoded.documento || '',
            rol: decoded.rol,
            permisos: decoded.permisos || []
        };

        // Asignar el documento del usuario para uso en controladores
        req.usuarioDocumento = req.usuario.documento;

        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        next(error);
    }
};

const verificarPermiso = (permisoRequerido) => {
    return (req, res, next) => {
        try {
            if (!req.usuario) {
                throw new AuthenticationError('Usuario no autenticado');
            }

            const permisos = req.usuario.permisos;
            if (!permisos || !permisos.includes(permisoRequerido)) {
                throw new AuthorizationError(
                    `No tienes permisos para realizar esta acción. Se requiere: ${permisoRequerido}`
                );
            }

            next();
        } catch (error) {
            return ResponseHandler.error(res, error);
        }
    };
};

const verificarRolAdministrador = async (req, res, next) => {
    try {
        if (!req.usuario) {
            throw new AuthenticationError('Usuario no encontrado en la solicitud');
        }

        if (req.usuario.rol !== ROLES.ADMINISTRADOR) {
            throw new AuthenticationError(
                "Acceso denegado. Se requieren permisos de administrador.",
                { rolActual: req.usuario.rol }
            );
        }

        next();
    } catch (error) {
        console.error("Error en verificación de rol:", error);
        ResponseHandler.error(res, error);
    }
};

const verificarLaboratorista = async (req, res, next) => {
    try {
        if (!req.usuario) {
            throw new AuthorizationError('Usuario no encontrado en la solicitud');
        }

        if (req.usuario.rol !== ROLES.LABORATORISTA) {
            throw new AuthorizationError('Acceso denegado - Se requiere rol de laboratorista');
        }

        req.laboratorista = {
            documento: req.usuario.documento,
            id: req.usuario.id
        };

        next();
    } catch (error) {
        console.error('Error en verificación de laboratorista:', error);
        next(error);
    }
};

module.exports = {
    login,
    verificarToken,
    verificarDocumento,
    verificarRolAdministrador,
    verificarLaboratorista,
    verificarPermiso,
    ROLES,
    PERMISOS
};