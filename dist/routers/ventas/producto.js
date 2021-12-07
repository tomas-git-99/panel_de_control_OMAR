"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../../controllers/ventas/producto");
const router = express_1.Router();
//CREAR PRODUCTO
router.post('/', producto_1.crearProducto);
//AGREGAR STOCK DE buscarProducto
router.put('/agregar/:id', producto_1.agregarMasStock);
//QUITAR STOCK DE PRODCUTO
router.put('/quitar/:id', producto_1.quitarStock);
//EDITAR PRODUCTO
router.put('/:id', producto_1.editarProducto);
//BUSCAR PRODUCTO POR NOMBRE
router.get('/search', producto_1.buscarProducto);
//ELIMINAR PRODUCTO 
router.delete('/:id', producto_1.eliminarProducto);
router.get('/', producto_1.hitorialProductos);
router.get('/:id', producto_1.obtenerUnoProducto);
router.get('/locales/todos', producto_1.soloLocales);
router.get('/locales/seleccionado/local', producto_1.buscarLocal);
exports.default = router;
//# sourceMappingURL=producto.js.map