"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuario_1 = require("../../controllers/ventas/usuario");
const validar_campo_1 = require("../../middlewares/validar-campo");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = express_1.Router();
//CREAR USUARIO NUEVO
router.post('/', [
    /*    validarJWT, */
    express_validator_1.check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    express_validator_1.check('dni_cuil', "El dni o cuil es obligatorio").not().isEmpty(),
    express_validator_1.check('password', "La contraseña es obligatorio").not().isEmpty(),
    express_validator_1.check('rol', "El rol es obligatorio").not().isEmpty(),
    validar_campo_1.validarCampos
], usuario_1.crearUsuario);
//EDITAR USUARIO NUEVO
router.put('/:id', usuario_1.editarUsuario);
//ELIMINAR USUARIO
router.delete('/:id', usuario_1.eliminarUsuario);
//LOGIN USUARIO
router.post('/login', usuario_1.login);
router.get('/token/verificar', [
    validar_JWT_1.validarJWT_Parmans_ID
], usuario_1.verificarToken);
router.get('/buscar/user/v', usuario_1.buscarUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map