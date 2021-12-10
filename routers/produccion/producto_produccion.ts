
import { Router } from "express";
import { actualizarProducto, crearProducto, obetenerUnProducto, obtenerProduccion, ordenarPorFechaExacta, ordenarPorRango } from "../../controllers/produccion/producto";


const router = Router();

//OBTENER PRODUCCION
router.get('/', obtenerProduccion);


router.get('/:id', obetenerUnProducto);

//AGREGAR PRODUCTO
router.post('/', crearProducto);

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto);



//search 

router.post('/busqueda/todos/:query', ordenarPorRango)

router.get('/busqueda/unico/dato/:query', ordenarPorFechaExacta)

export default router;