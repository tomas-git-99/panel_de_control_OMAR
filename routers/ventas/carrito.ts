import { Router } from "express";
import { agregarCarrito, mostrarCarrito } from "../../controllers/ventas/carrito";


const router = Router();


//AGREGAR A CARRITO
router.post("/", agregarCarrito);


//REMOVER DE CARRITO


//MOSTRAR EL CARRITO

router.get("/:id", mostrarCarrito)

export default router;