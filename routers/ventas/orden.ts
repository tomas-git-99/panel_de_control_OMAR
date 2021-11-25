import { Router } from "express";
import { buscarOrden, buscarOrdenDNI, confirmarCompra, generarOrden, ordenDetalles } from "../../controllers/ventas/orden";


const router = Router();


//GENERAR ORDEN

router.post('/:idCliente/:idUsuario', generarOrden)

// GENERAR DETALLES DE COMPRA
router.post('/detalles/:id/:idProducto', ordenDetalles)


// GENERAR ORDEN SUBIENDO EL PDF A NUBE
router.post('/confirmar/:id', confirmarCompra)


// BUSCAR ORDEN POR ID O DNI

//ID
router.get('/',buscarOrden)

//dni_cuil
router.get('/dni',buscarOrdenDNI)



// CARRITO


export default router;