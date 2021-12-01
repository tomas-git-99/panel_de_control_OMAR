import { Router } from "express";
import { agregarDirecciones, obtenerDireccion } from "../../controllers/ventas/direccion";



const router = Router();


//AGREGAR NUEVA DIRECCION CON ID
router.post('/:id', agregarDirecciones)

//OBTENER TODAS LA DIRECCION CON UN ID
router.get('/:id', obtenerDireccion)

export default router;