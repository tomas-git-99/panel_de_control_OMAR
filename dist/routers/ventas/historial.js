"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historial_1 = require("../../controllers/ventas/historial");
const router = (0, express_1.Router)();
router.get('/', historial_1.buscarLocales);
router.get('/buscar/:local', historial_1.buscarPorLocal);
router.post('/fecha/local', historial_1.filtroPorFechas);
exports.default = router;
//# sourceMappingURL=historial.js.map