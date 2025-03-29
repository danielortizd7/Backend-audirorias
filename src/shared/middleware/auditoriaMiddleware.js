const auditoriaService = require("../../app/auditoria/services/auditoriaService");
const { PERMISOS } = require('../config/rolesConfig');

const registrarAccion = (req, res, next) => {
  // Guardar la función original de res.send
  const originalSend = res.send;

  // Sobrescribir res.send para capturar la respuesta
  res.send = function (data) {
    // Restaurar la función original
    res.send = originalSend;

    // Crear el registro de auditoría
    const registroAuditoria = {
      usuario: {
        id: req.user?.id || 'desconocido',
        nombre: req.user?.nombre || 'desconocido',
        rol: req.user?.rol || 'desconocido',
        documento: req.user?.documento || 'desconocido',
        permisos: req.user?.permisos || []
      },
      accion: {
        tipo: req.method,
        ruta: req.originalUrl,
        descripcion: `${req.method} ${req.originalUrl}`,
        permisosRequeridos: obtenerPermisosRequeridos(req.method, req.originalUrl)
      },
      detalles: {
        idMuestra: req.params?.idMuestra || req.body?.idMuestra,
        cambios: req.method === 'PUT' ? req.body : undefined,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      estado: res.statusCode < 400 ? 'exitoso' : 'fallido',
      mensaje: typeof data === 'string' ? data : JSON.stringify(data)
    };

    // Registrar la acción de forma asíncrona
    auditoriaService.registrarAccion(registroAuditoria)
      .catch(error => console.error('Error al registrar auditoría:', error));

    // Llamar a la función original de res.send
    return originalSend.call(this, data);
  };

  next();
};

// Función auxiliar para determinar los permisos requeridos según la ruta y método
const obtenerPermisosRequeridos = (metodo, ruta) => {
  const permisosRequeridos = [];

  // Mapear rutas a permisos
  if (ruta.includes('/api/auditoria')) {
    if (ruta.includes('/registros')) permisosRequeridos.push(PERMISOS.VER_AUDITORIA);
    if (ruta.includes('/exportar')) permisosRequeridos.push(PERMISOS.EXPORTAR_AUDITORIA);
    if (ruta.includes('/filtrar')) permisosRequeridos.push(PERMISOS.FILTRAR_AUDITORIA);
  } else if (ruta.includes('/api/resultados')) {
    if (metodo === 'GET') permisosRequeridos.push(PERMISOS.VER_RESULTADOS);
    if (metodo === 'POST') permisosRequeridos.push(PERMISOS.REGISTRAR_RESULTADOS);
    if (metodo === 'PUT') permisosRequeridos.push(PERMISOS.EDITAR_RESULTADOS);
    if (metodo === 'POST' && ruta.includes('/verificar')) permisosRequeridos.push(PERMISOS.VERIFICAR_RESULTADOS);
  } else if (ruta.includes('/api/muestras')) {
    if (metodo === 'GET') permisosRequeridos.push(PERMISOS.VER_MUESTRAS);
    if (metodo === 'POST') permisosRequeridos.push(PERMISOS.REGISTRAR_MUESTRA);
    if (metodo === 'PUT') permisosRequeridos.push(PERMISOS.EDITAR_MUESTRA);
    if (metodo === 'DELETE') permisosRequeridos.push(PERMISOS.ELIMINAR_MUESTRA);
  }

  return permisosRequeridos;
};

module.exports = {
  registrarAccion
}; 