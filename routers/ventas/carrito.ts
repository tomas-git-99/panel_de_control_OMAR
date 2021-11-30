import { Router } from "express";
import { agregarCarrito } from "../../controllers/ventas/carrito";


const router = Router();


//AGREGAR A CARRITO
router.post("/", agregarCarrito);


//REMOVER DE CARRITO

export default router;