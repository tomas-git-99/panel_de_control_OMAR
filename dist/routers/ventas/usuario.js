"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_1 = require("../../controllers/ventas/usuario");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = express_1.Router();
//CREAR USUARIO NUEVO
router.post('/', usuario_1.crearUsuario);
//EDITAR USUARIO NUEVO
router.put('/:id', usuario_1.editarUsuario);
//ELIMINAR USUARIO
router.delete('/:id', usuario_1.eliminarUsuario);
//LOGIN USUARIO
router.post('/login', usuario_1.login);
router.get('/token/verificar', [
    validar_JWT_1.validarJWT_Parmans_ID
], usuario_1.verificarToken);
exports.default = router;
//# sourceMappingURL=usuario.js.map