"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_1 = require("../../controllers/ventas/carrito");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = (0, express_1.Router)();
//AGREGAR A CARRITO
router.post("/", [
    validar_JWT_1.validarJWT,
], carrito_1.agregarCarrito);
//REMOVER DE CARRITO
router.delete("/:id", carrito_1.eliminarCarrito);
//MOSTRAR EL CARRITO
router.get("/:id", carrito_1.mostrarCarrito);
//cambiar carrito
router.put("/:id", carrito_1.modificarCarrito);
router.get("/mostrar/:id", carrito_1.mostrarCantidad_Actual_Carrito);
///PASAR DE CARRITO A ORDEN_DETALLE, Y COMPLETAR ORDEN////
////////////////QUITAR STOCK POR UNIDAD Y TALLE////////////////////
router.put("/:id/:id_orden", carrito_1.descontarPorUnidad);
/////////////// QUITAR STOCK EN EL TOTAL DEL PRODUCTO ////////////////////
router.put("/total/:id/:id_orden", carrito_1.descontarElTotal);
router.put("/confirmar/compra/:id/:id_orden", carrito_1.pruebaParaDescontar); /// estas el prueba
exports.default = router;
//# sourceMappingURL=carrito.js.map