"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../../controllers/ventas/producto");
const express_validator_1 = require("express-validator");
const validar_campo_1 = require("../../middlewares/validar-campo");
const validar_JWT_1 = require("../../middlewares/validar-JWT");
const router = express_1.Router();
//CREAR PRODUCTO
router.post('/', [
    validar_JWT_1.validarJWT,
    express_validator_1.check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    express_validator_1.check('precio', 'Es obligatorio el precio').not().isEmpty(),
    validar_campo_1.validarCampos,
], producto_1.crearProducto);
//AGREGAR STOCK DE buscarProducto
router.put('/agregar/:id', producto_1.agregarMasStock);
//QUITAR STOCK DE PRODCUTO
router.put('/quitar/:id', producto_1.quitarStock);
//EDITAR PRODUCTO
router.put('/:id', producto_1.editarProducto);
//BUSCAR PRODUCTO POR NOMBRE
router.get('/search', producto_1.buscarProducto);
router.get('/search/index/new/h/u', producto_1.buscarProductosDoble);
//ELIMINAR PRODUCTO 
router.delete('/:id', producto_1.eliminarProducto);
router.get('/', producto_1.hitorialProductos);
router.get('/:id', producto_1.obtenerUnoProducto);
router.get('/locales/todos', producto_1.soloLocales);
router.get('/locales/seleccionado/local', producto_1.buscarLocal);
router.post('/locales/migrar/p/new', producto_1.cambiarProductosDeLocal);
exports.default = router;
//# sourceMappingURL=producto.js.map