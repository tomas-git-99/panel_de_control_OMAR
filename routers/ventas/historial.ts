import { Router } from "express";
import { buscarLocales, buscarPorLocal, filtroPorFechas } from "../../controllers/ventas/historial";



const router = Router();


router.get('/', buscarLocales)


router.get('/buscar/:local', buscarPorLocal)


router.post('/fecha/local', filtroPorFechas)





export default router;