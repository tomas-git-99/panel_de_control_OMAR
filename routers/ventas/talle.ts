import { Router } from "express";
import { agregarTalle } from "../../controllers/ventas/talle";


const router = Router();



//AGREGAR TALLE CON ID:
router.post('/:id', agregarTalle)



export default router;