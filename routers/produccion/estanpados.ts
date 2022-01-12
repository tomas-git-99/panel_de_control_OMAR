import { Router } from "express";
import { cambiarEstanpado, getEstanpadores, nuevoEstanpador, obtenerEstanpados } from "../../controllers/produccion/estanpados";


const router = Router();



router.get('/', obtenerEstanpados)


router.put('/:id', cambiarEstanpado)



router.get('/oficial', getEstanpadores)



router.post('/', nuevoEstanpador)




export default router;