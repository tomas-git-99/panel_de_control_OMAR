
import { Router } from "express";
import { actualizarProducto, crearProducto, obetenerUnProducto, obtenerProduccion, ordenarPorFechaExacta, ordenarPorRango, unicoDatoQuery } from "../../controllers/produccion/producto";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";


const router = Router();

//OBTENER PRODUCCION
router.get('/', obtenerProduccion);


router.get('/:id', obetenerUnProducto);

//AGREGAR PRODUCTO
router.post('/',[
    validarJWT,
], crearProducto);

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto);



//search 

router.post('/busqueda/todos/:query', ordenarPorRango)

router.post('/busqueda/unico/dato/:query', ordenarPorFechaExacta)

router.get('/busqueda/unicos/completo/p/:query', unicoDatoQuery)

export default router;