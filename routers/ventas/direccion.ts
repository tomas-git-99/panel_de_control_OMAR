import { Router } from "express";
import { agregarDirecciones, editarDireccion, obtenerDireccion } from "../../controllers/ventas/direccion";



const router = Router();


//AGREGAR NUEVA DIRECCION CON ID
router.post('/:id', agregarDirecciones)

//OBTENER TODAS LA DIRECCION CON UN ID
router.get('/:id', obtenerDireccion)
router.put('/:id', editarDireccion)
export default router;