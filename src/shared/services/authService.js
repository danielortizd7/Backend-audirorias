const jwt = require('jsonwebtoken');
const axios = require('axios');
const NodeCache = require('node-cache');
const { AuthenticationError } = require('../errors/AppError');

// Cache para almacenar tokens verificados y sus estados
const tokenCache = new NodeCache({ stdTTL: 300 }); // 5 minutos de caché

class AuthService {
    constructor() {
        this.userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3000';
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async verifyToken(token) {
        try {
            // Verificar si el token está en caché
            const cachedToken = tokenCache.get(token);
            if (cachedToken) {
                return cachedToken;
            }

            // Verificar con el servicio de usuarios
            const response = await axios.post(`${this.userServiceUrl}/api/auth/verify`, { token });
            
            if (response.data.valid) {
                // Almacenar en caché
                tokenCache.set(token, response.data.user);
                return response.data.user;
            }

            throw new AuthenticationError('Token inválido');
        } catch (error) {
            if (error.response) {
                // El servicio de usuarios respondió con un error
                throw new AuthenticationError(error.response.data.message || 'Error de verificación de token');
            }
            throw error;
        }
    }

    async revokeToken(token) {
        try {
            // Notificar al servicio de usuarios sobre la revocación
            await axios.post(`${this.userServiceUrl}/api/auth/revoke`, { token });
            
            // Eliminar de la caché
            tokenCache.del(token);
        } catch (error) {
            console.error('Error al revocar token:', error);
            throw error;
        }
    }

    async validateUserPermissions(user, requiredPermissions) {
        try {
            // Verificar permisos con el servicio de usuarios
            const response = await axios.post(`${this.userServiceUrl}/api/auth/validate-permissions`, {
                userId: user.id,
                permissions: requiredPermissions
            });

            return response.data.hasPermissions;
        } catch (error) {
            console.error('Error al validar permisos:', error);
            return false;
        }
    }

    // Método para verificar si un token está revocado
    async isTokenRevoked(token) {
        try {
            const response = await axios.get(`${this.userServiceUrl}/api/auth/revoked-tokens/${token}`);
            return response.data.revoked;
        } catch (error) {
            return false; // Si hay error, asumimos que no está revocado
        }
    }

    // Método para limpiar la caché de tokens
    clearTokenCache() {
        tokenCache.flushAll();
    }
}

module.exports = new AuthService(); 