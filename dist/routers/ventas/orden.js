"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_1 = require("../../controllers/ventas/orden");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = (0, express_1.Router)();
//GENERAR ORDEN 
router.post('/:idCliente/:idUsuario/:idDireccion', [
    validar_JWT_1.validarJWT,
], orden_1.generarOrden);
// GENERAR DETALLES DE COMPRA
router.post('/detalles/:idOrden/:idProducto', [
    validar_JWT_1.validarJWT,
], orden_1.ordenDetalles);
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
router.get('/historial/p/id', orden_1.buscarPorID);
router.get('/imprimir/parami/:id', orden_1.imptimirSoloVentas);
// CARRITO
//ORDEN PUBLICO 
router.get('/publico/orden/completo/:idUsuario/:idCliente', orden_1.generarOrdenPublico);
exports.default = router;
//# sourceMappingURL=orden.js.map