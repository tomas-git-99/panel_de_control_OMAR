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
exports.ordenDetalleGet = exports.modificarOrden = void 0;
const descontar_orden_1 = require("../../helpers/descontar_orden");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const modificarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { cantidad, talle } = req.body;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findByPk(id);
        const productos = yield producto_1.Producto.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto);
        const talles = yield talles_1.Talle.findAndCountAll({ where: { id_producto: ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto } });
        const orden = yield orden_1.Orden.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_orden);
        let productos_sin_stock = [];
        //ACA SI LO QUIERE MODIFICAR A CURVO
        if (talle == null) {
            //VERIFICAR SI ES POR TALLE O TOTAL
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let data = (0, descontar_orden_1.descontarCurvaTalle)(cantidad, talles.rows, ordenDetalle, orden, productos);
                if (data.productosSinStock.length > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.productosSinStock
                    });
                }
                for (let t of talles.rows) {
                    for (let i of data.talleStock) {
                        if (t.talle == i.talle) {
                            //await t.update({cantidad:i.cantidad})
                        }
                    }
                }
                //await ordenDetalle!.update({cantidad:data?.cantidadTotalDetalle, talle:productos?.talles})
                //await orden!.update({total:data?.cantidadTotalOrden})
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let cantidadAntigua = ordenDetalle.cantidad / largoDeTalle.split(',').length;
                let data = (0, descontar_orden_1.descontarCurvas)(cantidad, cantidadAntigua, ordenDetalle, orden, productos);
                if (((_a = data === null || data === void 0 ? void 0 : data.err) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.err
                    });
                }
                //await ordenDetalle?.update({cantidad:data.cantidadTotalDetalle, talle:productos.talles})
                //await productos?.update({cantidad:data.productoStock})
                //await orden?.update({total:data.cantidadTotalOrden})
            }
        }
        else {
            //ACA ES CUANDO EL USUARIO MANDA EL TALLE Y LA CANTIDAD
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let talleCurvaoTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                const data = (0, descontar_orden_1.descontarCurvaTalle_talleManda)(cantidad, talle, talles.rows, ordenDetalle, orden, productos);
                console.log(data);
                if (data.productosSinStock.length > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.productosSinStock
                    });
                }
                for (let t of talles.rows) {
                    for (let i of data.tallesDescontar) {
                        if (t.talle == i.talle) {
                            //await t.update({cantidad:i.cantidad})
                        }
                    }
                }
                //await ordenDetalle?.update({cantidad:cantidad, talle:talle})
                //await orden?.update({total:data?.cantidadTotalOrden})
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let data = (0, descontar_orden_1.descontarCurva_talleManda)(cantidad, talle, ordenDetalle, orden, productos);
                if (data.productosSinStock.length > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.productosSinStock
                    });
                }
                //await ordenDetalle!.update({cantidad:cantidad, talle:talle});
                //await productos.update({cantidad:data?.cantidaDeProducto});
                //await orden?.update ({total:data?.cantidadTotalOrden})
            }
        }
        res.json({
            ordenDetalle
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.modificarOrden = modificarOrden;
const ordenDetalleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: id } });
        res.json({
            ok: true,
            ordenDetalle
        });
    }
    catch (error) {
    }
});
exports.ordenDetalleGet = ordenDetalleGet;
//# sourceMappingURL=orden_detalle.js.map