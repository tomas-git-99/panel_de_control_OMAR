
import { Router } from "express";
import { actualizarProducto, crearProducto, obetenerUnProducto, obtenerProduccion } from "../../controllers/produccion/producto";


const router = Router();

//OBTENER PRODUCCION
router.get('/', obtenerProduccion);


router.get('/:id', obetenerUnProducto);

//AGREGAR PRODUCTO
router.post('/', crearProducto);

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto);





export default router;