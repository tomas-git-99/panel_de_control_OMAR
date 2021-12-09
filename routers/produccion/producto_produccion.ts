
import { Router } from "express";
import { actualizarProducto, crearProducto, obtenerProduccion } from "../../controllers/produccion/producto";


const router = Router();

//OBTENER PRODUCCION
router.get('/', obtenerProduccion);

//AGREGAR PRODUCTO
router.post('/', crearProducto);

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto);





export default router;