"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taller_1 = require("../../controllers/produccion/taller");
const router = (0, express_1.Router)();
//OBTENER TALLER 
router.get('/', taller_1.obtenerTaller);
//AGREGAR PRODUCTO
router.post('/', taller_1.crearTaller);
//ACTUALIZAR PRODUCTO
router.put("/:id", taller_1.actualizarTaller);
//ELIMINAR TALLER
router.delete("/:id", taller_1.eliminarTaller);
exports.default = router;
//# sourceMappingURL=taller.js.map