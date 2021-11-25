import { Router } from "express";
import { buscarCliente, crearCliente, editarCliente } from "../../controllers/ventas/cliente";


const router = Router();



// BUSCAR CLIENTE
router.get('/', buscarCliente)

// CREAR NUEVO CLIENTE
router.post('/', crearCliente);

// EDITAR CLIENTE
router.put('/:id', editarCliente)




export default router;