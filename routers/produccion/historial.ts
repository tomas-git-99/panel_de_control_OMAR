import { Router } from "express";
import { historialTaller } from "../../controllers/produccion/historial";


const router = Router();



//MOSTRAR HISTORIAL CON TALLER

router.get('/:id', historialTaller);

// MOSTRAR HISTORIAL SOLO PRODUCTOS


export default router;