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
exports.default = router;
//# sourceMappingURL=carrito.js.map