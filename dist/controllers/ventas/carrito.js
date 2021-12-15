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
const dist_1 = require("sequelize/dist");
const carrito_1 = require("../../models/ventas/carrito");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const agregarCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificar = yield carrito_1.Carrito.findAll({ where: { [dist_1.Op.and]: [{ id_usuario: req.body.id_usuario }, { id_producto: req.body.id_producto }] } });
        let cantidadBody = parseInt(req.body.cantidad);
        const talle = parseInt(req.body.talle);
        for (let e of verificar) {
            if (e.talle == talle) {
                console.log("talle");
                let nuevaCantidad = cantidadBody + e.cantidad;
                yield e.update({ cantidad: nuevaCantidad });
                return res.json({
                    ok: true,
                });
            }
        }
        if (req.body.talle == null || req.body.talle === undefined) {
            for (let e of verificar) {
                if (e.talle == null) {
                    console.log("null");
                    let nuevaCantidad = cantidadBody + e.cantidad;
                    yield e.update({ cantidad: nuevaCantidad });
                    return res.json({
                        ok: true,
                    });
                }
            }
        }
        const carrito = new carrito_1.Carrito(req.body);
        yield carrito.save();
        res.json({
            ok: true,
            carrito
        });
    }
    catch (error) {
        console.log(error);
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
        let sumaTotal = 0;
        let idProductos = [];
        carrito.map(e => {
            idProductos.push(e.id_producto);
        });
        const talle = yield talles_1.Talle.findAll({ where: { id_producto: idProductos } });
        const productos = yield producto_1.Producto.findAll({ where: { id: idProductos } });
        let productos_sin_stock = [];
        let stockDisponible = talle.map(e => {
            carrito.map(p => {
                if (p.id_producto == e.id_producto) {
                    if (p.talle == e.talle) {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            let nombre_producto = productos.map(n => { var _a; return (_a = n.id == e.id_producto) !== null && _a !== void 0 ? _a : n; });
                            productos_sin_stock.push(`El producto "${nombre_producto.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                        }
                    }
                }
            });
        });
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        talle.map((e, i) => {
            carrito.map((p, c) => __awaiter(void 0, void 0, void 0, function* () {
                if (e.id_producto == p.id_producto) {
                    let producto_dato = productos.map(n => { var _a; return (_a = n.id == e.id_producto) !== null && _a !== void 0 ? _a : n; });
                    let orden = {
                        id_orden,
                        id_producto: p.id_producto,
                        nombre_producto: producto_dato.nombre,
                        talle: p.talle,
                        cantidad: p.cantidad,
                        precio: producto_dato.precio
                    };
                    let nuevaSuma = p.cantidad * producto_dato.precio;
                    sumaTotal += sumaTotal + nuevaSuma;
                    let nuevoStock = p.cantidad - e.cantidad;
                    yield talle[i].update({ cantidad: nuevoStock })
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
        const orden = yield orden_1.Orden.findByPk(id_orden);
        yield orden.update({ total: sumaTotal });
        res.json({
            ok: true,
            msg: "Su compra fue exitosa"
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
        //PRIMERO VERIFICAR SI AHI STOCK EN CADA PRODUCTO
        let productos_sin_stock = [];
        let stock_disponible = productos.map(e => {
            carrito.map(p => {
                if (e.id == p.id_producto) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                    }
                }
            });
        });
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        //FIN PRIMERO VERIFICAR SI AHI STOCK EN CADA PRODUCTO
        //DESCONTANDO PRODUCTO DE STOCK TOTAL
        productos.map((e, i) => {
            carrito.map((p, c) => __awaiter(void 0, void 0, void 0, function* () {
                if (e.id == p.id_producto) {
                    let orden = {
                        id_orden,
                        id_producto: p.id_producto,
                        nombre_producto: e.nombre,
                        talle: p.talle,
                        cantidad: p.cantidad,
                        precio: e.precio
                    };
                    let nuevaSuma = p.cantidad * e.precio;
                    sumaTotal += sumaTotal + nuevaSuma;
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
        // FIN DESCONTANDO PRODUCTO DE STOCK TOTAL
        const orden = yield orden_1.Orden.findByPk(id_orden);
        yield orden.update({ total: sumaTotal });
        res.json({
            ok: true,
            msg: "Su compra fue exitosa"
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