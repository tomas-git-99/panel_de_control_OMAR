import { Router } from "express";
import { crearUsuario, editarUsuario, eliminarUsuario, login } from "../../controllers/ventas/usuario";


const router = Router();




//CREAR USUARIO NUEVO
router.post('/', crearUsuario)


//EDITAR USUARIO NUEVO
router.put('/:id', editarUsuario)


//ELIMINAR USUARIO
router.delete('/:id', eliminarUsuario)

//LOGIN USUARIO

router.post('/login', login)


export default router;