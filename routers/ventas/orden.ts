import { Router } from "express";
import { generarOrden } from "../../controllers/ventas/orden";


const router = Router();


//GENERAR ORDEN

router.post('/:idCliente/:idUsuario', generarOrden)

// GENERAR DETALLES DE COMPRA



// GENERAR ORDEN SUBIENDO EL PDF A NUBE





// BUSCAR ORDEN POR ID O DNI




// CARRITO


export default router;