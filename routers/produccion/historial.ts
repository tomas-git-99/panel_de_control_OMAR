import { Router } from "express";
import { buscarProductosFecha, historialTaller } from "../../controllers/produccion/historial";


const router = Router();



//MOSTRAR HISTORIAL CON TALLER

router.get('/:id', historialTaller);

// MOSTRAR HISTORIAL SOLO PRODUCTOS



//buscar producto para pagar 


router.get('/pagar/:id', buscarProductosFecha)

export default router;