import { Router } from "express";
import { buscarOrden, buscarOrdenDNI, confirmarCompra, confirmarPedido, generarOrden, historialOrden, imptimirSoloVentas, ordenDetalles, ordenParaImprimir } from "../../controllers/ventas/orden";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";


const router = Router();


//GENERAR ORDEN 
router.post('/:idCliente/:idUsuario/:idDireccion',[
    validarJWT,
    validarCampos,
], generarOrden)

// GENERAR DETALLES DE COMPRA
router.post('/detalles/:idOrden/:idProducto',[
    validarJWT,
    validarCampos,
], ordenDetalles)


// GENERAR ORDEN SUBIENDO EL PDF A NUBE
router.put('/confirmar/:idOrden', confirmarPedido)


// BUSCAR ORDEN POR ID O DNI

//ID
router.get('/',buscarOrden)


// VA SER OPCIONAL BUSCAR POR DNI O CUIL TOVIA VA ESTAR EB DUDA

//dni_cuil
router.get('/dni',buscarOrdenDNI)

router.get('/full/:id', ordenParaImprimir);

router.get('/historial/full', historialOrden)

router.get('/imprimir/parami/:id', imptimirSoloVentas)

// CARRITO


export default router;