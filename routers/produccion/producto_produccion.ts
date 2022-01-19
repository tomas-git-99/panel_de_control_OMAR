
import { Router } from "express";
import { actualizarProducto, agregarProductoAestampos, buscar, crearProducto, eliminarProducto, eliminarProductoDeEstampados, obetenerUnProducto, obtenerProduccion, ordenarPorFechaExacta, ordenarPorRango, unicoDatoQuery } from "../../controllers/produccion/producto";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";


const router = Router();

//OBTENER PRODUCCION
router.get('/', obtenerProduccion);


router.get('/:id', obetenerUnProducto);

router.delete('/item/:id', eliminarProducto)

//AGREGAR PRODUCTO
router.post('/',[
    validarJWT,
], crearProducto);

//ACTUALIZAR PRODUCTO
router.put('/:id', actualizarProducto);


router.post('/agregar/:id', agregarProductoAestampos)


router.delete('/:id', eliminarProductoDeEstampados)



//search 

router.post('/busqueda/todos/:query', ordenarPorRango)

router.post('/busqueda/unico/dato/:query', ordenarPorFechaExacta)

router.get('/busqueda/unicos/completo/p/:query', unicoDatoQuery)


router.get('/busqueda/name', buscar)

export default router;