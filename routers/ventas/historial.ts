import { Router } from "express";
import { buscarLocales, buscarPorLocal } from "../../controllers/ventas/historial";



const router = Router();


router.get('/', buscarLocales)


router.get('/buscar/:local', buscarPorLocal)





export default router;