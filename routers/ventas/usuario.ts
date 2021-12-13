import { Router } from "express";
import { crearUsuario, editarUsuario, eliminarUsuario, login, verificarToken } from "../../controllers/ventas/usuario";
import { validarJWT, validarJWT_Parmans_ID } from "../../middlewares/validar-JWT";


const router = Router();




//CREAR USUARIO NUEVO
router.post('/', crearUsuario)


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