"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_1 = require("../../controllers/ventas/usuario");
const router = (0, express_1.Router)();
//CREAR USUARIO NUEVO
router.post('/', usuario_1.crearUsuario);
//EDITAR USUARIO NUEVO
router.put('/:id', usuario_1.editarUsuario);
//ELIMINAR USUARIO
router.delete('/:id', usuario_1.eliminarUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map