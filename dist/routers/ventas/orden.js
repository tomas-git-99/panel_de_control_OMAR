"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_1 = require("../../controllers/ventas/orden");
const router = (0, express_1.Router)();
//GENERAR ORDEN
router.post('/:idCliente/:idUsuario', orden_1.generarOrden);
// GENERAR DETALLES DE COMPRA
router.post('/detalles/:id/:idProducto', orden_1.ordenDetalles);
// GENERAR ORDEN SUBIENDO EL PDF A NUBE
router.post('/confirmar/:id', orden_1.confirmarCompra);
// BUSCAR ORDEN POR ID O DNI
//ID
router.get('/', orden_1.buscarOrden);
//dni_cuil
router.get('/dni', orden_1.buscarOrdenDNI);
// CARRITO
exports.default = router;
//# sourceMappingURL=orden.js.map