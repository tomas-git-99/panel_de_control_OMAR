"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rollos_1 = require("../../controllers/produccion/rollos");
const router = (0, express_1.Router)();
//CREAR NUEVO ROLLO 
router.post('/', rollos_1.crearNuevoRollo);
//OBTENER TODOS LOS ROLLO 
router.get('/', rollos_1.obtenerTodoRollo);
//OBTNER TODOS LOS ROLLOS CON EL ID_ROLLO
router.get('/:id', rollos_1.obtenerRollosID);
//AGREGAR ROLLOS NUEVO CON ID_ROLLO
router.post('/rollos/:id', rollos_1.agregarRollosID);
//CAMBIAR DATOS DE UN ROLLO
router.put('/:id', rollos_1.cambiarDatosDeRollos);
//ELIMINAR ROLLOS NUEVO CON ID_ROLLO
router.delete('/:id', rollos_1.eliminarRolloTodos);
router.delete('/rollo/:id', rollos_1.eliminarUnRollo);
exports.default = router;
//# sourceMappingURL=rollos.js.map