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
exports.modificarOrden = void 0;
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const modificarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { cantidad, talle } = req.body;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findByPk(id);
        const productos = yield producto_1.Producto.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto);
        const talles = yield talles_1.Talle.findAndCountAll({ where: { id_producto: ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto } });
        let productos_sin_stock = [];
        //ACA VERIFICAMOS SI CURVA
        if (talle == null) {
            //VERIFICAR SI ES POR TALLE O TOTAL
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let cantidadCurva = cantidad * talles.count;
                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!!
                for (let t of talles.rows) {
                    if (t.cantidad < cantidad || t.cantidad == 0) {
                        productos_sin_stock.push(`El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad} `);
                    }
                }
                if (productos_sin_stock.length > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock
                    });
                }
                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!! FINAL
                let cantidadDescontarPorTalle = ordenDetalle.cantidad / talles.count;
                if (cantidadDescontarPorTalle > cantidad) {
                    let newCantidadCurva = cantidadDescontarPorTalle - cantidad;
                    // en esta parte dentri que descontar solo lo que esta en "newCantidadCurva" nada mas
                    for (let t of talles.rows) {
                        let nuevoCantidadTalle = t.cantidad + newCantidadCurva;
                        //ahora solo tenes que hacer update a talle correspospondiente
                    }
                }
                else {
                    let newCantidadCurvaMayor = cantidad - cantidadDescontarPorTalle;
                    for (let t of talles.rows) {
                        let nuevoCantidadTalle = t.cantidad - newCantidadCurvaMayor;
                        //ahora solo tenes que hacer update a talle correspospondiente
                    }
                    // en esta parte dentri que sumar solo lo que esta en "newCantidadCurvaMayor" nada mas
                    console.log(newCantidadCurvaMayor);
                }
                res.json({
                    msg: cantidadCurva
                });
            }
        }
    }
    catch (error) {
    }
});
exports.modificarOrden = modificarOrden;
//# sourceMappingURL=orden_detalle.js.map