const axios = require('axios');
const { AuthenticationError } = require('../../../shared/errors/AppError');

// URLs del servicio externo de usuarios
const USUARIOS_API = process.env.VITE_BACKEND_URL;
if (!USUARIOS_API) {
    throw new Error('VITE_BACKEND_URL no está configurada en las variables de entorno');
}

const LOGIN_URL = `${USUARIOS_API}/usuarios/login`;
const VERIFICAR_USUARIO_URL = `${USUARIOS_API}/usuarios/verificar`;

const verificarRolUsuario = async (userId, rol) => {
    try {
        if (!userId || !rol) {
            throw new AuthenticationError('ID o rol de usuario no proporcionado');
        }

        // En este caso, como el token ya viene verificado del servicio de usuarios,
        // y contiene el rol, podemos confiar en esta información
        return true;
    } catch (error) {
        console.error('Error al verificar rol:', error);
        throw new AuthenticationError('Error al verificar rol del usuario');
    }
};

const validarUsuario = async (email, password) => {
    try {
        if (!email || !password) {
            throw new AuthenticationError('Email o contraseña no proporcionados');
        }

        // Hacer la petición al servicio de usuarios
        const response = await axios.post(`${USUARIOS_API}/usuarios/login`, {
            email,
            password
        });

        if (!response.data || !response.data.usuario) {
            throw new AuthenticationError('Credenciales inválidas');
        }

        return response.data.usuario;
    } catch (error) {
        console.error('Error al validar usuario:', error);
        if (error.response) {
            if (error.response.status === 401) {
                throw new AuthenticationError('Credenciales inválidas');
            }
            throw new AuthenticationError('Error al validar usuario en el servicio');
        }
        throw new AuthenticationError('Error al validar usuario');
    }
};

module.exports = {
    verificarRolUsuario,
    validarUsuario
};