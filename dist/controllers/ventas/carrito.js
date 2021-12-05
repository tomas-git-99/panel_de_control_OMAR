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
exports.mostrarCantidad_Actual_Carrito = exports.modificarCarrito = exports.descontarElTotal = exports.descontarPorUnidad = exports.eliminarCarrito = exports.mostrarCarrito = exports.agregarCarrito = void 0;
const carrito_1 = require("../../models/ventas/carrito");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
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
const eliminarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const carrito = yield carrito_1.Carrito.findByPk(id);
    yield (carrito === null || carrito === void 0 ? void 0 : carrito.destroy());
    res.status(200).json({
        ok: true,
        msg: "se elimino con exito"
    });
});
exports.eliminarCarrito = eliminarCarrito;
const descontarPorUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, id_orden } = req.params;
        //CON middleware VAMOS A COMPROBAR SI EL ID DE ESE USUARIO ES VALIDO
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let idProductos = [];
        carrito.map(e => {
            idProductos.push(e.id_producto);
        });
        const talle = yield talles_1.Talle.findAll({ where: { id_producto: idProductos } });
        talle.map((e, i) => {
            carrito.map((p) => __awaiter(void 0, void 0, void 0, function* () {
                if (p.id_producto == e.id_producto) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        return res.json({
                            ok: false,
                            msg: ` el producto con el id ${e.id_producto} no tiene stock suficiente`
                        });
                    }
                    let actualizarStock = e.cantidad - p.cantidad;
                    yield talle[i].update({ cantidad: actualizarStock });
                }
            }));
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: idProductos } });
        productos.map((e, i) => {
            carrito.map((p, c) => __awaiter(void 0, void 0, void 0, function* () {
                if (e.id == p.id_producto) {
                    let orden = {
                        id_orden,
                        id_producto: p.id_producto,
                        cantidad: p.cantidad,
                        precio: e.precio
                    };
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    yield carrito[c].destroy();
                }
            }));
        });
        res.json({
            ok: true,
            msg: "todo salio correctamente"
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
});
exports.descontarPorUnidad = descontarPorUnidad;
const descontarElTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, id_orden } = req.params;
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let sumaTotal = 0;
        let idProductos = [];
        let datos = [];
        carrito.map(e => {
            idProductos.push(e.id_producto);
            datos = [...datos, { id_producto: e.id_producto, cantidad: e.cantidad }];
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: idProductos } });
        productos.map((e, i) => {
            carrito.map((p, c) => __awaiter(void 0, void 0, void 0, function* () {
                if (e.id == p.id_producto) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        return res.json({
                            ok: false,
                            msg: ` el producto ${e.nombre} no tiene stock suficiente`
                        });
                    }
                    let orden = {
                        id_orden,
                        id_producto: p.id_producto,
                        cantidad: p.cantidad,
                        precio: e.precio
                    };
                    let nuevoStock = e.cantidad - p.cantidad;
                    yield productos[i].update({ cantidad: nuevoStock })
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    yield carrito[c].destroy();
                }
            }));
        });
        res.json({
            ok: true,
            msg: "Todo salio exelente"
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
});
exports.descontarElTotal = descontarElTotal;
const eliminarCarritoYagregarAorden = (id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
});
const modificarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const carrito = yield carrito_1.Carrito.findByPk(id);
    yield (carrito === null || carrito === void 0 ? void 0 : carrito.update(req.body));
    const cantidad = carrito === null || carrito === void 0 ? void 0 : carrito.cantidad;
    res.json({
        ok: true,
        cantidad
    });
});
exports.modificarCarrito = modificarCarrito;
const mostrarCantidad_Actual_Carrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const carrito = yield carrito_1.Carrito.findByPk(id);
    const producto = yield producto_1.Producto.findByPk(carrito === null || carrito === void 0 ? void 0 : carrito.id_producto);
    const cantidadActual = producto === null || producto === void 0 ? void 0 : producto.cantidad;
    const cantidadCarrito = carrito === null || carrito === void 0 ? void 0 : carrito.cantidad;
    res.json({
        ok: true,
        cantidadActual,
        cantidadCarrito
    });
});
exports.mostrarCantidad_Actual_Carrito = mostrarCantidad_Actual_Carrito;
//# sourceMappingURL=carrito.js.map