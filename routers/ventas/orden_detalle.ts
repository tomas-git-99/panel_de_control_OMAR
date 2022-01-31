import { Router } from "express";
import { modificarOrden, ordenDetalleGet } from "../../controllers/ventas/orden_detalle";


const router = Router();


router.put('/:id', modificarOrden);
router.get('/:id', ordenDetalleGet);


export default router;
