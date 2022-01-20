import { Router } from "express";
import { buscarProductosFecha, historialTaller, pagarAtalleres } from "../../controllers/produccion/historial";


const router = Router();



//MOSTRAR HISTORIAL CON TALLER

router.get('/:id', historialTaller);

// MOSTRAR HISTORIAL SOLO PRODUCTOS



//buscar producto para pagar 


router.post('/pagar/:id', buscarProductosFecha)



//pagar Talleres

router.post('/pagar/estado/:id', pagarAtalleres)

export default router;