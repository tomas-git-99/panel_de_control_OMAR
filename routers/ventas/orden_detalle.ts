import { Router } from "express";
import { modificarOrden } from "../../controllers/ventas/orden_detalle";


const router = Router();


router.put('/:id', modificarOrden);


export default router;
