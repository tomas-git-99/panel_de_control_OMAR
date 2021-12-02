"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const direccion_1 = require("../../controllers/ventas/direccion");
const router = express_1.Router();
//AGREGAR NUEVA DIRECCION CON ID
router.post('/:id', direccion_1.agregarDirecciones);
//OBTENER TODAS LA DIRECCION CON UN ID
router.get('/:id', direccion_1.obtenerDireccion);
exports.default = router;
//# sourceMappingURL=direccion.js.map