import { Router } from "express";
import { check } from "express-validator";
import { crearUsuario, editarUsuario, eliminarUsuario, login, verificarToken } from "../../controllers/ventas/usuario";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT, validarJWT_Parmans_ID } from "../../middlewares/validar-JWT";


const router = Router();




//CREAR USUARIO NUEVO
router.post('/',[
 /*    validarJWT, */
    check('nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check('dni_cuil', "El dni o cuil es obligatorio").not().isEmpty(),
    check('password', "La contraseña es obligatorio").not().isEmpty(),
    check('rol', "El rol es obligatorio").not().isEmpty(),
    validarCampos
], crearUsuario)


//EDITAR USUARIO NUEVO
router.put('/:id', editarUsuario)


//ELIMINAR USUARIO
router.delete('/:id', eliminarUsuario)

//LOGIN USUARIO

router.post('/login', login)


router.get('/token/verificar',[
    validarJWT_Parmans_ID
],verificarToken)

export default router;