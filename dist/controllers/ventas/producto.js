"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitorialProductos = exports.quitarStock = exports.agregarMasStock = exports.eliminarProducto = exports.buscarProducto = exports.editarProducto = exports.crearProducto = void 0;
const dist_1 = require("sequelize/dist");
const producto_1 = require("../../models/ventas/producto");
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, cantidad, local, tela, precio } = req.body;
        const datos = {
            nombre,
            cantidad,
            local,
            tela,
            precio
        };
        const producto = new producto_1.Producto(datos);
        yield producto.save();
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.crearProducto = crearProducto;
const editarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const producto = yield producto_1.Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: `El usuario con el id ${id} no existe`
            });
        }
        yield producto.update(body);
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.editarProducto = editarProducto;
const buscarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buscarProducto = req.query;
    const producto = yield producto_1.Producto.findAll({ where: {
            nombre: { [dist_1.Op.like]: '%' + buscarProducto.nombre + '%' },
        } });
    res.json({
        ok: true,
        producto
    });
});
exports.buscarProducto = buscarProducto;
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const producto = yield producto_1.Producto.findByPk(id);
    yield (producto === null || producto === void 0 ? void 0 : producto.destroy());
    res.json({
        ok: true,
        msg: `El producto ${producto === null || producto === void 0 ? void 0 : producto.nombre} fue eliminado con exito`
    });
});
exports.eliminarProducto = eliminarProducto;
const agregarMasStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { agregar } = req.body;
    const producto = yield producto_1.Producto.findByPk(id);
    const nuevoStock = agregar + (producto === null || producto === void 0 ? void 0 : producto.cantidad);
    yield (producto === null || producto === void 0 ? void 0 : producto.update({ cantidad: nuevoStock }));
    res.json({
        ok: true,
        producto
    });
});
exports.agregarMasStock = agregarMasStock;
const quitarStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quitar } = req.body;
    const producto = yield producto_1.Producto.findByPk(id);
    const nuevoStock = producto.cantidad - quitar;
    yield (producto === null || producto === void 0 ? void 0 : producto.update({ cantidad: nuevoStock }));
    res.json({
        ok: true,
        producto
    });
});
exports.quitarStock = quitarStock;
const hitorialProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hola");
    const productos = yield producto_1.Producto.findAll();
    res.json({
        ok: true,
        productos
    });
});
exports.hitorialProductos = hitorialProductos;
//# sourceMappingURL=producto.js.map