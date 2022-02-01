import { Router } from "express";
import { agregarOrdenDetalle, deshacerOrdenDetalle, modificarOrden, ordenDetalleGet } from "../../controllers/ventas/orden_detalle";


const router = Router();


router.put('/:id', modificarOrden);
router.get('/:id', ordenDetalleGet);
router.post('/:idOrden', agregarOrdenDetalle)
router.delete('/:idOrden/:idDetalle', deshacerOrdenDetalle)

export default router;
