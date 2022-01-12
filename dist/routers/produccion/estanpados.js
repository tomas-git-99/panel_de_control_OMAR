"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estanpados_1 = require("../../controllers/produccion/estanpados");
const router = express_1.Router();
router.get('/', estanpados_1.obtenerEstanpados);
router.put('/:id', estanpados_1.cambiarEstanpado);
router.get('/oficial', estanpados_1.getEstanpadores);
router.post('/', estanpados_1.nuevoEstanpador);
exports.default = router;
//# sourceMappingURL=estanpados.js.map