import { Router } from "express";
import { cambiarEstanpado, getEstanpadores, nuevoEstanpador, obtenerEstanpadorID, obtenerEstanpados } from "../../controllers/produccion/estanpados";


const router = Router();



router.get('/', obtenerEstanpados)


router.get('/unico/:id', obtenerEstanpadorID)


router.put('/:id', cambiarEstanpado)



router.get('/oficial', getEstanpadores)



router.post('/', nuevoEstanpador)




export default router;