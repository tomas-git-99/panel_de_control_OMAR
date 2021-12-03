"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_1 = require("../../controllers/ventas/carrito");
const router = express_1.Router();
//AGREGAR A CARRITO
router.post("/", carrito_1.agregarCarrito);
//REMOVER DE CARRITO
router.delete("/:id", carrito_1.eliminarCarrito);
//MOSTRAR EL CARRITO
router.get("/:id", carrito_1.mostrarCarrito);
///PASAR DE CARRITO A ORDEN_DETALLE, Y COMPLETAR ORDEN////
////////////////QUITAR STOCK POR UNIDAD Y TALLE////////////////////
router.put("/:id/:id_orden", carrito_1.descontarPorUnidad);
/////////////// QUITAR STOCK EN EL TOTAL DEL PRODUCTO ////////////////////
router.put("total/:id/:id_orden", carrito_1.descontarElTotal);
exports.default = router;
//# sourceMappingURL=carrito.js.map