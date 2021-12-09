import { Router } from "express";
import { actualizarTaller, crearTaller, eliminarTaller } from "../../controllers/produccion/taller";


const router = Router();


//AGREGAR PRODUCTO
router.post('/', crearTaller)

//ACTUALIZAR PRODUCTO

router.put("/:id", actualizarTaller);
//ELIMINAR TALLER

router.delete("/:id", eliminarTaller);


export default router;