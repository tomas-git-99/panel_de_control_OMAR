"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../../controllers/produccion/producto");
const router = (0, express_1.Router)();
//OBTENER PRODUCCION
router.get('/', producto_1.obtenerProduccion);
router.get('/:id', producto_1.obetenerUnProducto);
//AGREGAR PRODUCTO
router.post('/', producto_1.crearProducto);
//ACTUALIZAR PRODUCTO
router.put('/:id', producto_1.actualizarProducto);
//search 
router.post('/busqueda/todos/:query', producto_1.ordenarPorRango);
router.get('/busqueda/unico/dato/:query', producto_1.ordenarPorFechaExacta);
exports.default = router;
//# sourceMappingURL=producto_produccion.js.map