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
exports.confirmarPedido = exports.buscarOrdenDNI = exports.buscarOrden = exports.confirmarCompra = exports.ordenDetalles = exports.generarOrden = void 0;
const dist_1 = require("sequelize/dist");
const cliente_1 = require("../../models/ventas/cliente");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const generarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCliente, idUsuario } = req.params;
        const datos = {
            id_cliente: idCliente,
            id_usuario: idUsuario,
        };
        const orden = new orden_1.Orden(datos);
        yield orden.save();
        res.json({
            ok: true,
            orden
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.generarOrden = generarOrden;
const ordenDetalles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrden, idProducto } = req.params;
        const { cantidad } = req.body;
        const orden = yield orden_1.Orden.findByPk(idOrden);
        if (!orden) {
            res.status(404).json({
                ok: false,
                msg: "NotFound: el id no existe"
            });
        }
        const producto = yield producto_1.Producto.findByPk(idProducto);
        if (!producto) {
            res.status(404).json({
                ok: false,
                msg: "NotFound: el id no existe"
            });
        }
        const datos = {
            id_orden: idOrden,
            id_producto: idProducto,
            cantidad,
            precio: producto === null || producto === void 0 ? void 0 : producto.precio
        };
        const ordenDetalle = new orden_detalle_1.OrdenDetalle(datos);
        yield ordenDetalle.save();
        res.json({
            ok: true,
            ordenDetalle
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.ordenDetalles = ordenDetalles;
const confirmarCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        //ACA TENEMOS QUE GENERAR EL PDF Y SUBIRLO AWS
        //const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden:id } });
        const orden = yield orden_1.Orden.findByPk(id);
        yield (orden === null || orden === void 0 ? void 0 : orden.update(body));
        res.json({
            ok: true,
            orden
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.confirmarCompra = confirmarCompra;
const buscarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buscarOrden = req.query;
    const orden = yield orden_1.Orden.findAll({ where: { id: { [dist_1.Op.like]: '%' + buscarOrden.id + '%' } } });
    res.json({
        ok: true,
        orden
    });
});
exports.buscarOrden = buscarOrden;
const buscarOrdenDNI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dni = req.query;
    const cliente = yield cliente_1.Cliente.findAll({ where: { dni_cuil: { [dist_1.Op.like]: '%' + dni + '%' } } });
    if (!cliente) {
        res.json({
            ok: false,
            msg: 'No existe ningun cliente con ese dni'
        });
    }
    const orden = yield orden_1.Orden.findAll({ where: { id_cliente: cliente.id } });
    if (!orden) {
        res.json({
            ok: false,
            msg: "no ahi ninguna orden con ese DNI o CUIL"
        });
    }
    res.json({
        ok: true,
        orden
    });
});
exports.buscarOrdenDNI = buscarOrdenDNI;
const confirmarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idOrden } = req.params;
    const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: idOrden } });
    let fullTotal = 0;
    yield ordenDetalle.map((e) => __awaiter(void 0, void 0, void 0, function* () {
        //suma y multiplica todas las compras
        const total = e.cantidad * e.precio;
        const producto = yield producto_1.Producto.findByPk(e.id_producto);
        //Descuenta del stock de la base de datos
        if (e.cantidad < producto.cantidad) {
            let actualStock = producto.cantidad - e.cantidad;
            yield (producto === null || producto === void 0 ? void 0 : producto.update({ cantidad: actualStock }));
        }
        else {
            res.json({
                ok: true,
                msg: "el producto con el id " + e.id_producto + " no tiene stock suficiente "
            });
        }
        fullTotal = fullTotal + total;
    }));
    const orden = yield orden_1.Orden.findByPk(idOrden);
    const body = {
        total: fullTotal,
    };
    yield (orden === null || orden === void 0 ? void 0 : orden.update(body));
    res.json({
        ok: true,
        orden,
        ordenDetalle
    });
});
exports.confirmarPedido = confirmarPedido;
//# sourceMappingURL=orden.js.map