"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_1 = require("../../controllers/ventas/orden");
const router = express_1.Router();
//GENERAR ORDEN 
router.post('/:idCliente/:idUsuario/:idDireccion', orden_1.generarOrden);
// GENERAR DETALLES DE COMPRA
router.post('/detalles/:idOrden/:idProducto', orden_1.ordenDetalles);
// GENERAR ORDEN SUBIENDO EL PDF A NUBE
router.put('/confirmar/:idOrden', orden_1.confirmarPedido);
// BUSCAR ORDEN POR ID O DNI
//ID
router.get('/', orden_1.buscarOrden);
// VA SER OPCIONAL BUSCAR POR DNI O CUIL TOVIA VA ESTAR EB DUDA
//dni_cuil
router.get('/dni', orden_1.buscarOrdenDNI);
router.get('/full/:id', orden_1.ordenParaImprimir);
router.get('/historial/full', orden_1.historialOrden);
// CARRITO
exports.default = router;
//# sourceMappingURL=orden.js.map