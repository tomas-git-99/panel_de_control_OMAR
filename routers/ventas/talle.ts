import { Router } from "express";
import { agregarTalle, eliminarTalle, restarTalle, sumarTalle } from "../../controllers/ventas/talle";


const router = Router();



//AGREGAR TALLE CON ID:
router.post('/:id', agregarTalle)

router.put('/suma/:id', sumarTalle)

router.put('/restar/:id', restarTalle)

router.delete('/:id', eliminarTalle)
export default router;