"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_1 = require("../../controllers/ventas/cliente");
const router = express_1.Router();
// BUSCAR CLIENTE
router.get('/', cliente_1.buscarCliente);
// CREAR NUEVO CLIENTE
router.post('/', cliente_1.crearCliente);
// EDITAR CLIENTE
router.put('/:id', cliente_1.editarCliente);
exports.default = router;
//# sourceMappingURL=cliente.js.map