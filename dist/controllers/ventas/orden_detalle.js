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
        //ACA SI LO QUIERE MODIFICAR A CURVO
        if (talle == null) {
            //VERIFICAR SI ES POR TALLE O TOTAL
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let cantidadCurva = cantidad * talles.count;
                //VERIFICAMOS SI EL ORDEN ANTERIOR ERA CURVO O POR TALLE
                let talleCurvaoTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                //ENTRAN SI ES TALLE UNICO EL ANTERIOR DATO
                if (talleCurvaoTalle.split(',').length == 1) {
                    let tallesDescontar = [];
                    let tallesDb = [];
                    for (let t of talles.rows) {
                        tallesDb = [...tallesDb, { talle: t.talle, cantidad: t.cantidad }];
                        if ((ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle) == t.talle) {
                            if ((ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.cantidad) > cantidad) {
                                //aca suma a la talle que falta
                                let nuevaCantidad = (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.cantidad) - cantidad;
                                let nuevaCantidadTalle = t.cantidad + nuevaCantidad;
                                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                            }
                            else {
                                //aca restamos el talle que falta
                                let nuevaCantidad = cantidad - (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.cantidad);
                                if (t.cantidad < nuevaCantidad || t.cantidad == 0) {
                                    productos_sin_stock.push(`El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${nuevaCantidad} `);
                                    /*   productos_sin_stock = [ ...productos_sin_stock, "jojo"] */
                                }
                                let nuevaCantidadTalle = t.cantidad - nuevaCantidad;
                                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                            }
                        }
                        else {
                            if (t.cantidad < cantidad || t.cantidad == 0) {
                                productos_sin_stock.push(`El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${cantidad} `);
                            }
                            let nuevaCantidad = t.cantidad - cantidad;
                            tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidad }];
                        }
                    }
                    //ACA VAMOS DESCONTAR TODO DE UNA, PARA AHORRAR EL PROBLEMA DE FALTA DE STOCK EN CADA TALLE
                    if (productos_sin_stock.length > 0) {
                        return res.json({
                            ok: false,
                            error: 2,
                            msg: "No ahi stock suficiente con los productos ...",
                            productos_sin_stock
                        });
                    }
                    /*
                                        console.log(cantidad + " cantidad para descontar  o sumar")
                                        console.log(ordenDetalle?.cantidad+ " cantidad anterior")
                                        
                    
                                        console.log(tallesDescontar)
                                        console.log(tallesDb) */
                    for (let t of talles.rows) {
                        for (let d of tallesDescontar) {
                            if (d.talle == t.talle) {
                                //aca hacemo el update de las nuevas cantidades
                            }
                        }
                    }
                }
                else if (talleCurvaoTalle.split(',').length > 1) { // ACA ENTRAR SI ES CURVO EL ANTERIOR DATO
                    let cantidadDescontarPorTalle = ordenDetalle.cantidad / talles.count;
                    let tallesDescontar = [];
                    if (cantidadDescontarPorTalle > cantidad) {
                        let newCantidadCurva = cantidadDescontarPorTalle - cantidad;
                        // en esta parte dentri que descontar solo lo que esta en "newCantidadCurva" nada mas
                        for (let t of talles.rows) {
                            let nuevoCantidadTalle = t.cantidad + newCantidadCurva;
                            //ahora solo tenes que hacer update a talle correspondiente
                        }
                    }
                    else {
                        let newCantidadCurvaMayor = cantidad - cantidadDescontarPorTalle; // la cantidad es 10 por talle
                        for (let t of talles.rows) {
                            if (t.cantidad < newCantidadCurvaMayor || t.cantidad == 0) {
                                productos_sin_stock.push(`El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${newCantidadCurvaMayor} `);
                            }
                            console.log(t.cantidad);
                            let nuevoCantidadTalle = t.cantidad - newCantidadCurvaMayor;
                            tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevoCantidadTalle }];
                        }
                        if (productos_sin_stock.length > 0) {
                            return res.json({
                                ok: false,
                                error: 2,
                                msg: "No ahi stock suficiente con los productos ...",
                                productos_sin_stock
                            });
                        }
                        //aca hacer el update de las nuevas cantidades
                    }
                }
                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!!
                /*                 for( let t of talles.rows) {
                
                                    if(t.cantidad < cantidad || t.cantidad == 0){
                
                                        productos_sin_stock.push(`El producto: "${productos?.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad} ` );
                
                                    }
                                }
                
                                if(productos_sin_stock.length > 0){
                                    return res.json({
                                        ok: false,
                                        error:2,
                                        msg: "No ahi stock suficiente con los productos ...",
                                        productos_sin_stock
                                    })
                                } */
                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!! FINAL
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                if (largoDeTalle.split(',').length == 1) {
                }
                else if (largoDeTalle.split(',').length > 1) {
                    let cantidadAntigua = ordenDetalle.cantidad / largoDeTalle.split(',').length;
                    if (cantidadAntigua > cantidad) {
                        let nuevaCurva = cantidadAntigua - cantidad;
                        let descontarNuevo = nuevaCurva * largoDeTalle.split(',').length;
                        console.log(nuevaCurva);
                        console.log(descontarNuevo);
                        console.log("descontar");
                    }
                    else {
                        let curvaNueva = cantidad - cantidadAntigua;
                        let descontarNuevo = curvaNueva * largoDeTalle.split(',').length;
                        console.log(curvaNueva);
                        console.log(descontarNuevo);
                        console.log("sumar");
                    }
                }
            }
        }
        else {
            //ACA ES CUANDO EL USUARIO MANDA EL TALLE Y LA CANTIDAD
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let talleCurvaoTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                //ENTRAN SI ES TALLE UNICO EL ANTERIOR DATO
                if (talleCurvaoTalle.split(',').length == 1) {
                    if (talle == (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle)) {
                        if (ordenDetalle.cantidad > cantidad) {
                            let nuevaCantidad = ordenDetalle.cantidad - cantidad;
                            console.log(nuevaCantidad);
                            console.log(ordenDetalle.cantidad + ' cantidad antigua');
                            console.log(cantidad + ' antigua para restar');
                            console.log('descontar');
                        }
                        else {
                            let nuevaCantidad = cantidad - ordenDetalle.cantidad;
                            console.log(nuevaCantidad);
                            console.log(ordenDetalle.cantidad + ' cantidad antigua');
                            console.log(cantidad + ' antigua para restar');
                            console.log('sumar');
                        }
                    }
                    else {
                        for (let t of talles.rows) {
                            if (t.talle == talle) {
                                console.log('hola');
                                //aca aumentar la cantidad de la cantidad antigua.
                            }
                            else if (t.talle == (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle)) {
                                console.log('perrin');
                                let nuevaCantidad = t.cantidad - cantidad;
                            }
                        }
                    }
                }
                else {
                }
            }
            else {
            }
        }
        res.json({
            ordenDetalle
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.modificarOrden = modificarOrden;
//# sourceMappingURL=orden_detalle.js.map