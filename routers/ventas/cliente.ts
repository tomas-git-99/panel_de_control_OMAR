import { Router } from "express";
import { buscarCliente, crearCliente, editarCliente } from "../../controllers/ventas/cliente";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";


const router = Router();



// BUSCAR CLIENTE
router.get('/', buscarCliente)

// CREAR NUEVO CLIENTE
router.post('/', crearCliente);

// EDITAR CLIENTE
router.put('/:id', editarCliente)




export default router;