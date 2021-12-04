import { Router } from "express";
import { agregarMasStock, buscarProducto, crearProducto, editarProducto, eliminarProducto, hitorialProductos, obtenerUnoProducto, quitarStock } from "../../controllers/ventas/producto";


const router = Router();



//CREAR PRODUCTO
router.post('/', crearProducto)


//AGREGAR STOCK DE buscarProducto
router.put('/agregar/:id', agregarMasStock)


//QUITAR STOCK DE PRODCUTO
router.put('/quitar/:id', quitarStock)

//EDITAR PRODUCTO
router.put('/:id', editarProducto)

//BUSCAR PRODUCTO POR NOMBRE
router.get('/search', buscarProducto)


//ELIMINAR PRODUCTO 

router.delete('/:id', eliminarProducto)


router.get('/', hitorialProductos)

router.get('/:id', obtenerUnoProducto)


export default router;