import { Router } from "express";
import { agregarMasStock, buscarLocal,
         buscarProducto, buscarProductosDoble, cambiarProductosDeLocal, crearProducto, 
         editarProducto, eliminarProducto, 
         hitorialProductos, obtenerUnoProducto, 
         quitarStock, soloLocales } from "../../controllers/ventas/producto";

import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";

const router = Router();



//CREAR PRODUCTO
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check('precio', 'Es obligatorio el precio' ).not().isEmpty(),
    validarCampos,
] ,crearProducto)


//AGREGAR STOCK DE buscarProducto
router.put('/agregar/:id', agregarMasStock)


//QUITAR STOCK DE PRODCUTO
router.put('/quitar/:id', quitarStock)

//EDITAR PRODUCTO
router.put('/:id', editarProducto)

//BUSCAR PRODUCTO POR NOMBRE
router.get('/search', buscarProducto)
router.get('/search/index/new/h/u', buscarProductosDoble)


//ELIMINAR PRODUCTO 

router.delete('/:id', eliminarProducto)


router.get('/', hitorialProductos)

router.get('/:id', obtenerUnoProducto)

router.get('/locales/todos', soloLocales)


router.get('/locales/seleccionado/local', buscarLocal)


router.post('/locales/migrar/p/new', cambiarProductosDeLocal)


export default router;