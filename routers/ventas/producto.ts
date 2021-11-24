import { Router } from "express";
import { buscarProducto, crearProducto, editarProducto, eliminarProducto } from "../../controllers/ventas/producto";


const router = Router();



//CREAR PRODUCTO
router.post('/', crearProducto)

//EDITAR PRODUCTO

router.put('/:id', editarProducto)

//BUSCAR PRODUCTO POR NOMBRE
router.get('/search', buscarProducto)


//ELIMINAR PRODUCTO 

router.delete('/:id', eliminarProducto)




export default router;