import { Router } from "express";
import { actualizarTaller, buscarUnicTaller, crearTaller, eliminarTaller, obtenerTaller } from "../../controllers/produccion/taller";


const router = Router();
//OBTENER TALLER 
router.get('/', obtenerTaller)


router.get("/buscar", buscarUnicTaller)


//AGREGAR PRODUCTO
router.post('/', crearTaller)

//ACTUALIZAR PRODUCTO

router.put("/:id", actualizarTaller);
//ELIMINAR TALLER

router.delete("/:id", eliminarTaller);


export default router;