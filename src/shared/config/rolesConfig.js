const ROLES = {
    ADMINISTRADOR: 'administrador',
    LABORATORISTA: 'laboratorista',
    CLIENTE: 'cliente'
};

const PERMISOS = {
    // Permisos de Muestras
    REGISTRAR_MUESTRA: 'registrar_muestra',
    VER_MUESTRAS: 'ver_muestras',
    EDITAR_MUESTRA: 'editar_muestra',
    ELIMINAR_MUESTRA: 'eliminar_muestra',
    
    // Permisos de Resultados
    REGISTRAR_RESULTADOS: 'registrar_resultados',
    VER_RESULTADOS: 'ver_resultados',
    EDITAR_RESULTADOS: 'editar_resultados',
    VERIFICAR_RESULTADOS: 'verificar_resultados',
    
    // Permisos de Usuarios
    GESTIONAR_USUARIOS: 'gestionar_usuarios',
    VER_USUARIOS: 'ver_usuarios',

    // Permisos de Auditoría
    VER_AUDITORIA: 'ver_auditoria',
    EXPORTAR_AUDITORIA: 'exportar_auditoria',
    FILTRAR_AUDITORIA: 'filtrar_auditoria'
};

const ROLES_PERMISOS = {
    [ROLES.ADMINISTRADOR]: [
        PERMISOS.REGISTRAR_MUESTRA,
        PERMISOS.VER_MUESTRAS,
        PERMISOS.EDITAR_MUESTRA,
        PERMISOS.ELIMINAR_MUESTRA,
        PERMISOS.VER_RESULTADOS,
        PERMISOS.GESTIONAR_USUARIOS,
        PERMISOS.VER_USUARIOS,
        // Permisos de auditoría para administrador
        PERMISOS.VER_AUDITORIA,
        PERMISOS.EXPORTAR_AUDITORIA,
        PERMISOS.FILTRAR_AUDITORIA
    ],
    [ROLES.LABORATORISTA]: [
        PERMISOS.VER_MUESTRAS,
        PERMISOS.REGISTRAR_RESULTADOS,
        PERMISOS.VER_RESULTADOS,
        PERMISOS.EDITAR_RESULTADOS,
        PERMISOS.VERIFICAR_RESULTADOS,
        // Permisos de auditoría limitados para laboratorista
        PERMISOS.VER_AUDITORIA,
        PERMISOS.FILTRAR_AUDITORIA
    ],
    [ROLES.CLIENTE]: [
        PERMISOS.VER_MUESTRAS,
        PERMISOS.VER_RESULTADOS
    ]
};

module.exports = {
    ROLES,
    PERMISOS,
    ROLES_PERMISOS
}; 