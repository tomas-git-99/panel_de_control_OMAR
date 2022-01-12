import { Router } from "express";
import { agregarRollosID, cambiarDatosDeRollos, crearNuevoRollo, obtenerRollosID, obtenerTodoRollo } from "../../controllers/produccion/rollos";


const router = Router();

//CREAR NUEVO ROLLO 
router.post('/', crearNuevoRollo);


//OBTENER TODOS LOS ROLLO 
router.get('/', obtenerTodoRollo);


//OBTNER TODOS LOS ROLLOS CON EL ID_ROLLO
router.get('/:id', obtenerRollosID)

//AGREGAR ROLLOS NUEVO CON ID_ROLLO


router.post('/rollos/:id', agregarRollosID)

//CAMBIAR DATOS DE UN ROLLO

router.put('/:id', cambiarDatosDeRollos)
export default router;