"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_detalle_1 = require("../../controllers/ventas/orden_detalle");
const router = (0, express_1.Router)();
router.put('/:id', orden_detalle_1.modificarOrden);
exports.default = router;
//# sourceMappingURL=orden_detalle.js.map