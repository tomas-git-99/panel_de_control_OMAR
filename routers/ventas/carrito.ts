import { Router } from "express";
import { agregarCarrito, eliminarCarrito, mostrarCarrito } from "../../controllers/ventas/carrito";


const router = Router();


//AGREGAR A CARRITO
router.post("/", agregarCarrito);


//REMOVER DE CARRITO
router.delete("/:id", eliminarCarrito);

//MOSTRAR EL CARRITO

router.get("/:id", mostrarCarrito)

export default router;