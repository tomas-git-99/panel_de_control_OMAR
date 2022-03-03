import { Router } from "express";
import { agregarCarrito, descontarElTotal, descontarPorUnidad, descontarProductosFull, eliminarCarrito, modificarCarrito, mostrarCantidad_Actual_Carrito, mostrarCarrito, nuevaFuncionParaDescontar, pruebaParaDescontar } from "../../controllers/ventas/carrito";
import { validarCampos } from "../../middlewares/validar-campo";
import { validarJWT } from "../../middlewares/validar-JWT";


const router = Router();


//AGREGAR A CARRITO
router.post("/",[
    validarJWT,
], agregarCarrito);


//REMOVER DE CARRITO
router.delete("/:id", eliminarCarrito);


//MOSTRAR EL CARRITO
router.get("/:id", mostrarCarrito)

//cambiar carrito
router.put("/:id", modificarCarrito)

router.get("/mostrar/:id", mostrarCantidad_Actual_Carrito)




///PASAR DE CARRITO A ORDEN_DETALLE, Y COMPLETAR ORDEN////

////////////////QUITAR STOCK POR UNIDAD Y TALLE////////////////////
router.put("/:id/:id_orden", descontarPorUnidad)


/////////////// QUITAR STOCK EN EL TOTAL DEL PRODUCTO ////////////////////

router.put("/total/:id/:id_orden", descontarElTotal)


/* router.put("/confirmar/compra/:id/:id_orden", pruebaParaDescontar)  *//// estas es para pruccion
router.put("/confirmar/compra/:id/:id_orden", nuevaFuncionParaDescontar) /// estas el prueba


export default router;