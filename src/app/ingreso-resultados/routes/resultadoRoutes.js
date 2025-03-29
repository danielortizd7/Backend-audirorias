const express = require("express");
const router = express.Router();
const resultadoController = require("../controllers/resultadoController");
const resultadoValidators = require("../validators/resultadoValidators");
const { verificarToken, verificarPermiso, PERMISOS } = require("../../../shared/middleware/authMiddleware");

// Rutas protegidas
router.use(verificarToken);

// Obtener todos los resultados
router.get("/resultados", 
  resultadoController.obtenerTodosResultados
);

// Obtener resultados de una muestra específica
router.get("/muestra/:idMuestra", 
    verificarPermiso(PERMISOS.VER_RESULTADOS),
    resultadoController.obtenerResultados
);

// Registrar resultados de una muestra
router.post("/registrar/:idMuestra", 
    verificarPermiso(PERMISOS.REGISTRAR_RESULTADOS),
    resultadoValidators.registrarResultado,
    resultadoController.registrarResultado
);

// Editar resultados de una muestra
router.put("/editar/:idMuestra",
    verificarPermiso(PERMISOS.EDITAR_RESULTADOS),
    resultadoValidators.editarResultado,
    resultadoController.editarResultado
);

// Verificar resultados de una muestra
router.post("/verificar/:idMuestra",
    verificarPermiso(PERMISOS.VERIFICAR_RESULTADOS),
    resultadoController.verificarResultado
);

module.exports = router;
