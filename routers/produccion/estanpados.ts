import { Router } from "express";
import { buscarEstapados, cambiarEstanpado, getEstanpadores, nuevoEstanpador, obtenerEstanpadorID, obtenerEstanpados } from "../../controllers/produccion/estanpados";


const router = Router();



router.get('/', obtenerEstanpados)


router.get('/unico/:id', obtenerEstanpadorID)


router.put('/:id', cambiarEstanpado)



router.get('/oficial', getEstanpadores)



router.post('/', nuevoEstanpador)



router.post('/buscar/filtro/:query', buscarEstapados)


export default router;