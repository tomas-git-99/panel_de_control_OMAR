"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_1 = require("../../controllers/ventas/carrito");
const router = (0, express_1.Router)();
//AGREGAR A CARRITO
router.post("/", carrito_1.agregarCarrito);
//REMOVER DE CARRITO
exports.default = router;
//# sourceMappingURL=carrito.js.map