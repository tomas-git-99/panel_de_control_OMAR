
import { Router } from "express";
import { actualizarProducto, crearProducto } from "../../controllers/produccion/producto";


const router = Router();



//AGREGAR PRODUCTO

router.post('/', crearProducto)

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto)





export default router;