import { Router } from "express";
import { buscarOrden, buscarOrdenDNI, confirmarCompra, confirmarPedido, generarOrden, ordenDetalles, ordenParaImprimir } from "../../controllers/ventas/orden";


const router = Router();


//GENERAR ORDEN 
router.post('/:idCliente/:idUsuario/:idDireccion', generarOrden)

// GENERAR DETALLES DE COMPRA
router.post('/detalles/:idOrden/:idProducto', ordenDetalles)


// GENERAR ORDEN SUBIENDO EL PDF A NUBE
router.put('/confirmar/:idOrden', confirmarPedido)


// BUSCAR ORDEN POR ID O DNI

//ID
router.get('/',buscarOrden)


// VA SER OPCIONAL BUSCAR POR DNI O CUIL TOVIA VA ESTAR EB DUDA
//dni_cuil
router.get('/dni',buscarOrdenDNI)

router.get('/full/:id', ordenParaImprimir);

// CARRITO


export default router;