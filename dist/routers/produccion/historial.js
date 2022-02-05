"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historial_1 = require("../../controllers/produccion/historial");
const router = express_1.Router();
//MOSTRAR HISTORIAL CON TALLER
router.get('/:id', historial_1.historialTaller);
// MOSTRAR HISTORIAL SOLO PRODUCTOS
//buscar producto para pagar 
router.post('/pagar/:id', historial_1.buscarProductosFecha);
//pagar Talleres
router.post('/pagar/estado/:id', historial_1.pagarAtalleres);
exports.default = router;
//# sourceMappingURL=historial.js.map