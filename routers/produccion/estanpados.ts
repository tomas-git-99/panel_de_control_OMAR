import { Router } from "express";
import { buscarEstampados, buscarEstapados, cambiarEstanpado, getEstanpadores, nuevoEstanpador, obtenerEstanpadorID, obtenerEstanpados } from "../../controllers/produccion/estanpados";


const router = Router();



router.get('/', obtenerEstanpados)


router.get('/unico/:id', obtenerEstanpadorID)


router.put('/:id', cambiarEstanpado)



router.get('/oficial', getEstanpadores)



router.post('/', nuevoEstanpador)



router.post('/buscar/filtro/:query', buscarEstapados)



router.get('/buscar/solo/nombre', buscarEstampados)
export default router;