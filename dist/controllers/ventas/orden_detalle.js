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
const descontar_orden_1 = require("../../helpers/descontar_orden");
const orden_1 = require("../../models/ventas/orden");
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
        const orden = yield orden_1.Orden.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_orden);
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
                        if (parseInt(ordenDetalle.talle) == t.talle) {
                            if (ordenDetalle.cantidad > cantidad) {
                                //aca suma a la talle que falta
                                let nuevaCantidad = ordenDetalle.cantidad - cantidad;
                                let nuevaCantidadTalle = t.cantidad + nuevaCantidad;
                                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                                console.log('hola');
                            }
                            else {
                                //aca restamos el talle que falta
                                let nuevaCantidad = cantidad - ordenDetalle.cantidad;
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
                            // nuevo 10400
                            // antiguo 40000
                            console.log(tallesDescontar);
                            console.log(tallesDb);
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
                    let cantidadTotal = talles.count * cantidad; //UPDATE A CANTIDAD DE ORDEN DETALLE;
                    //await ordenDetalle?.update({cantidad:cantidadTotal, talle: productos?.talles});
                    let sumaAntigua = ordenDetalle.cantidad * ordenDetalle.precio;
                    let nuevaTotalOrden = orden.total - sumaAntigua; // RESTAMOS LA CANTIDAD ANTIGUA 
                    let precioNuevo = ordenDetalle.precio * cantidadTotal;
                    //await orden?.update({total: nuevaTotalOrden + precioNuevo}) //MODIFICAR EL TOTAL DEL ORDEN
                    //console.log('NUEVO TOTAL : ' + (nuevaTotalOrden + precioNuevo) )
                    //console.log('total: ' + orden!.total);
                    for (let t of talles.rows) {
                        for (let d of tallesDescontar) {
                            if (d.talle == t.talle) {
                                //aca hacemo el update de las nuevas cantidades
                                //await t.update({cantidad:d.cantidad});
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
                            //await t.update({cantidad:nuevoCantidadTalle});
                            //ahora solo tenes que hacer update a talle correspondiente
                        }
                    }
                    else {
                        let newCantidadCurvaMayor = cantidad - cantidadDescontarPorTalle; // la cantidad es 10 por talle
                        let tallesDb = [];
                        for (let t of talles.rows) {
                            tallesDb = [...tallesDb, { talle: t.talle, cantidad: t.cantidad }];
                            if (t.cantidad < newCantidadCurvaMayor || t.cantidad == 0) {
                                productos_sin_stock.push(`El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${newCantidadCurvaMayor} `);
                            }
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
                        let cantidadTotal = talles.count * cantidad; //UPDATE A CANTIDAD DE ORDEN DETALLE;
                        //await ordenDetalle?.update({cantidad:cantidadTotal, talle: productos?.talles});
                        let sumaAntigua = ordenDetalle.cantidad * ordenDetalle.precio;
                        let nuevaTotalOrden = orden.total - sumaAntigua; // RESTAMOS LA CANTIDAD ANTIGUA 
                        let precioNuevo = ordenDetalle.precio * cantidadTotal;
                        //await orden?.update({total: nuevaTotalOrden + precioNuevo}) //MODIFICAR EL TOTAL DEL ORDEN
                        for (let t of talles.rows) {
                            for (let d of tallesDescontar) {
                                if (d.talle == t.talle) {
                                    //aca hacemo el update de las nuevas cantidades
                                    //await t.update({cantidad:d.cantidad});
                                }
                            }
                        }
                        console.log(tallesDescontar);
                        console.log(tallesDb);
                        //aca hacer el update de las nuevas cantidades
                    }
                }
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                if (largoDeTalle.split(',').length == 1) {
                    console.log("prueba perrona");
                }
                else if (largoDeTalle.split(',').length > 1) {
                    let cantidadAntigua = ordenDetalle.cantidad / largoDeTalle.split(',').length;
                    let data = (0, descontar_orden_1.descontarCurvas)(cantidad, cantidadAntigua, ordenDetalle, orden, productos);
                    console.log(data);
                    console.log('gato');
                    /*                     if(cantidadAntigua > cantidad){
                    
                                            let nuevaCurva = cantidadAntigua - cantidad;
                    
                                            let sumarNuevo = nuevaCurva * largoDeTalle.split(',').length;
                    
                                            //console.log(cantidad * largoDeTalle.split(',').length);
                    
                                            let sumaAntigua = ordenDetalle!.cantidad * ordenDetalle!.precio;
                    
                                            let cantidadTotal = largoDeTalle.split(',').length * cantidad; //UPDATE A CANTIDAD DE ORDEN DETALLE;
                    
                                            //await ordenDetalle?.update({cantidad:cantidadTotal, talle: productos?.talles});
                    
                    
                                            let nuevaTotalOrden = orden!.total - sumaAntigua;  // RESTAMOS LA CANTIDAD ANTIGUA
                        
                                            let precioNuevo = ordenDetalle!.precio * cantidadTotal;
                        
                                            //await orden?.update({total: nuevaTotalOrden + precioNuevo}) //MODIFICAR EL TOTAL DEL ORDEN
                    
                                            let totalSumar = cantidad * largoDeTalle.split(',').length
                    
                                            //await ordenDetalle?.update({cantidad: totalSumar})
                    
                                            console.log(nuevaCurva);
                                            console.log(sumarNuevo);
                    
                                            console.log("sumar")
                    
                    
                                        }else{
                    
                                            let curvaNueva = cantidad - cantidadAntigua;
                                            let descontarNuevo = curvaNueva * largoDeTalle.split(',').length;
                    
                    
                                            if(productos.cantidad < descontarNuevo || productos.cantidad == 0){
                                                productos_sin_stock.push(`El producto: "${productos?.nombre}" con stock de actual: ${productos.cantidad}, cantidad que quieres colocar: ${descontarNuevo} ` );
                                            }
                    
                                            let totalProducto = productos.cantidad - descontarNuevo;
                                            //await productos.update({cantidad: totalProducto});
                    
                                            //await ordenDetalle?.update({cantidad: cantidad * largoDeTalle.split(',').length})
                    
                                            console.log(curvaNueva);
                                            console.log(descontarNuevo);
                                            console.log("descontar")
                    
                                        } */
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
                            else if (t.talle == parseInt(ordenDetalle.talle)) {
                                console.log('perrin');
                                let nuevaCantidad = t.cantidad - cantidad;
                            }
                        }
                        let talleProducto = talles.rows.find(p => p.talle == talle);
                        if (talleProducto.cantidad < cantidad || (talleProducto === null || talleProducto === void 0 ? void 0 : talleProducto.cantidad) == 0) {
                            return res.json({
                                ok: false,
                                error: 2,
                                msg: "No ahi stock suficiente con los productos ...",
                                productos_sin_stock: `El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${talleProducto.talle}" con stock de actual: ${talleProducto === null || talleProducto === void 0 ? void 0 : talleProducto.cantidad}, cantidad que quieres colocar: ${cantidad}`
                            });
                        }
                        let newCantidad = talleProducto.cantidad - cantidad;
                        console.log(newCantidad);
                        console.log((talleProducto === null || talleProducto === void 0 ? void 0 : talleProducto.cantidad) + ' antigua');
                        console.log(cantidad);
                        let talleProductoSumar = talles.rows.find(p => p.talle == parseInt(ordenDetalle.talle));
                        let newCantidadSumar = talleProductoSumar.cantidad + ordenDetalle.cantidad;
                        console.log(newCantidadSumar);
                        console.log((talleProductoSumar === null || talleProductoSumar === void 0 ? void 0 : talleProductoSumar.cantidad) + ' antigua, talle : ' + (talleProductoSumar === null || talleProductoSumar === void 0 ? void 0 : talleProductoSumar.talle));
                        console.log(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.cantidad);
                    }
                }
                else if (talleCurvaoTalle.split(',').length > 1) {
                    let talleProducto = talles.rows.find(p => p.talle == talle);
                    if (talleProducto.cantidad < cantidad || (talleProducto === null || talleProducto === void 0 ? void 0 : talleProducto.cantidad) == 0) {
                        return res.json({
                            ok: false,
                            error: 2,
                            msg: "No ahi stock suficiente con los productos ...",
                            productos_sin_stock: `El producto: "${productos === null || productos === void 0 ? void 0 : productos.nombre} y talle: ${talleProducto.talle}" con stock de actual: ${talleProducto === null || talleProducto === void 0 ? void 0 : talleProducto.cantidad}, cantidad que quieres colocar: ${cantidad}`
                        });
                    }
                    for (let t of talles.rows) {
                        if (t.talle == talle) {
                            if (ordenDetalle.cantidad > cantidad) {
                                let nuevaCantidad = ordenDetalle.cantidad - cantidad;
                            }
                            else {
                                let nuevaCantidad = cantidad - ordenDetalle.cantidad;
                            }
                        }
                        else {
                            let retaurarCantida = t.cantidad + ordenDetalle.cantidad;
                        }
                    }
                }
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                if (largoDeTalle.split(',').length == 1) {
                    if (ordenDetalle.cantidad > cantidad) {
                        const newCantidad = ordenDetalle.cantidad - cantidad;
                    }
                    else {
                        const newCantidad = cantidad - ordenDetalle.cantidad;
                    }
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