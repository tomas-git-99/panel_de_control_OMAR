import { Router } from "express";
import { agregarCarrito, descontarElTotal, descontarPorUnidad, eliminarCarrito, modificarCarrito, mostrarCantidad_Actual_Carrito, mostrarCarrito } from "../../controllers/ventas/carrito";


const router = Router();


//AGREGAR A CARRITO
router.post("/", agregarCarrito);


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


export default router;