import { Router } from "express";
import { crearProducto } from "../../controllers/ventas/producto";


const router = Router();



//CREAR PRODUCTO
router.post('/', crearProducto)

//EDITAR PRODUCTO



//BUSCAR PRODUCTO POR NOMBRE



//ELIMINAR PRODUCTO 






export default router;