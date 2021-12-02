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
exports.mostrarCarrito = exports.agregarCarrito = void 0;
const carrito_1 = require("../../models/ventas/carrito");
const producto_1 = require("../../models/ventas/producto");
const agregarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario, id_producto, cantidad } = req.body;
        const dato = {
            id_usuario,
            id_producto,
            cantidad
        };
        const carrito = new carrito_1.Carrito(dato);
        yield carrito.save();
        res.json({
            ok: true,
            carrito
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.agregarCarrito = agregarCarrito;
const mostrarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let idProductos = [];
        yield carrito.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            idProductos.push(e.id_producto);
        }));
        const productos = yield producto_1.Producto.findAll({ where: { id: idProductos } });
        let carrito_full = [];
        carrito.map((e, i) => {
            productos.find((r, s) => {
                if (r.id == e.id_producto) {
                    carrito_full = [...carrito_full, { carritos: carrito[i], productos: productos[s] }];
                }
            });
        });
        res.json({
            ok: true,
            carrito_full,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.mostrarCarrito = mostrarCarrito;
//# sourceMappingURL=carrito.js.map