"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../../controllers/produccion/producto");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = (0, express_1.Router)();
//OBTENER PRODUCCION
router.get('/', producto_1.obtenerProduccion);
router.get('/:id', producto_1.obetenerUnProducto);
//AGREGAR PRODUCTO
router.post('/', [
    validar_JWT_1.validarJWT,
], producto_1.crearProducto);
//ACTUALIZAR PRODUCTO
router.put('/:id', producto_1.actualizarProducto);
router.post('/agregar/:id', producto_1.agregarProductoAestampos);
//search 
router.post('/busqueda/todos/:query', producto_1.ordenarPorRango);
router.post('/busqueda/unico/dato/:query', producto_1.ordenarPorFechaExacta);
router.get('/busqueda/unicos/completo/p/:query', producto_1.unicoDatoQuery);
router.get('/busqueda/name', producto_1.buscar);
exports.default = router;
//# sourceMappingURL=producto_produccion.js.map