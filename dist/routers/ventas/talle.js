"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const talle_1 = require("../../controllers/ventas/talle");
const router = express_1.Router();
//AGREGAR TALLE CON ID:
router.post('/:id', talle_1.agregarTalle);
router.put('/suma/:id', talle_1.sumarTalle);
router.put('/restar/:id', talle_1.restarTalle);
router.delete('/:id');
exports.default = router;
//# sourceMappingURL=talle.js.map