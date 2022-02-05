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
exports.deshacerOrdenDetalle = exports.agregarOrdenDetalle = exports.ordenDetalleGet = exports.modificarOrden = void 0;
const descontar_orden_1 = require("../../helpers/descontar_orden");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const modificarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { cantidad, talle, precio } = req.body;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findByPk(id);
        const productos = yield producto_1.Producto.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto);
        const talles = yield talles_1.Talle.findAndCountAll({ where: { id_producto: ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto } });
        const orden = yield orden_1.Orden.findByPk(ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_orden);
        let productos_sin_stock = [];
        //ACA SI LO QUIERE MODIFICAR A CURVO
        if (talle == null) {
            //VERIFICAR SI ES POR TALLE O TOTAL
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let data = (0, descontar_orden_1.descontarCurvaTalle)(cantidad, talles.rows, ordenDetalle, orden, productos, precio);
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
                            yield t.update({ cantidad: i.cantidad });
                        }
                    }
                }
                yield ordenDetalle.update({ cantidad: data === null || data === void 0 ? void 0 : data.cantidadTotalDetalle, talle: productos === null || productos === void 0 ? void 0 : productos.talles, precio: (precio == null ? ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.precio : precio) });
                yield orden.update({ total: data === null || data === void 0 ? void 0 : data.cantidadTotalOrden });
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let cantidadAntigua = ordenDetalle.cantidad / largoDeTalle.split(',').length;
                let data = (0, descontar_orden_1.descontarCurvas)(cantidad, cantidadAntigua, ordenDetalle, orden, productos, precio);
                if (((_a = data === null || data === void 0 ? void 0 : data.err) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.err
                    });
                }
                yield (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.update({ cantidad: data.cantidadTotalDetalle, talle: productos.talles, precio: (precio == null ? ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.precio : precio) }));
                yield (productos === null || productos === void 0 ? void 0 : productos.update({ cantidad: data.productoStock }));
                yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: data.cantidadTotalOrden }));
            }
        }
        else {
            //ACA ES CUANDO EL USUARIO MANDA EL TALLE Y LA CANTIDAD
            if ((productos === null || productos === void 0 ? void 0 : productos.cantidad) == null) {
                let talleCurvaoTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                const data = (0, descontar_orden_1.descontarCurvaTalle_talleManda)(cantidad, talle, talles.rows, ordenDetalle, orden, productos, precio);
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
                            yield t.update({ cantidad: i.cantidad });
                        }
                    }
                }
                yield (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.update({ cantidad: cantidad, talle: talle, precio: (precio == null ? ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.precio : precio) }));
                yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: data === null || data === void 0 ? void 0 : data.cantidadTotalOrden }));
            }
            else {
                let largoDeTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let data = (0, descontar_orden_1.descontarCurva_talleManda)(cantidad, talle, ordenDetalle, orden, productos, precio);
                if (data.productosSinStock.length > 0) {
                    return res.json({
                        ok: false,
                        error: 2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data === null || data === void 0 ? void 0 : data.productosSinStock
                    });
                }
                yield ordenDetalle.update({ cantidad: cantidad, talle: talle, precio: (precio == null ? ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.precio : precio) });
                yield productos.update({ cantidad: data === null || data === void 0 ? void 0 : data.cantidaDeProducto });
                yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: data === null || data === void 0 ? void 0 : data.cantidadTotalOrden }));
            }
        }
        res.json({
            ok: true,
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
const ordenDetalleGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: id } });
        const orden = yield orden_1.Orden.findByPk(id);
        res.json({
            ok: true,
            ordenDetalle,
            orden
        });
    }
    catch (error) {
    }
});
exports.ordenDetalleGet = ordenDetalleGet;
const agregarOrdenDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrden } = req.params;
        const { id, cantidad, talle, precio } = req.body;
        let sumaTotal = 0;
        let productos_sin_stock = [];
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: id } });
        const productos = yield producto_1.Producto.findAll({ where: { id: id } });
        talles.map(e => {
            if (talle == e.talle) {
                if (e.cantidad < cantidad || e.cantidad == 0) {
                    if (id == e.id_producto) {
                        let dato_producto = productos.find(e => e.id == id);
                        productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad que quieres agregar: ${cantidad} `);
                    }
                }
            }
            else if (talle == null) {
                if (e.cantidad < cantidad || e.cantidad == 0) {
                    let dato_producto = productos.find(e => e.id == id);
                    productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad que quieres agregar: ${cantidad} `);
                }
            }
        });
        if (productos[0].cantidad !== null) {
            productos.map(e => {
                if (e.id == id) {
                    if (talle == null) {
                        let cantidadDeTalle = e.talles.split(",").length;
                        let contador = cantidad * cantidadDeTalle;
                        /*    for(let count of cantidadDeTalle){
                               contador += cantidad;
                           }
    */
                        if (e.cantidad < contador || e.cantidad == 0) {
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad que quieres agregar(curva): ${contador} `);
                        }
                    }
                    else {
                        if (e.cantidad < cantidad || e.cantidad == 0) {
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad que quieres agregar: ${cantidad} `);
                        }
                    }
                }
            });
        }
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                error: 2,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        for (let i of productos) {
            let Comprobar = talle == null ? false : true;
            if (Comprobar == true) {
                for (let t of talles) {
                    if (talle == t.talle) {
                        let orden = {
                            id_orden: idOrden,
                            id_producto: i.id,
                            nombre_producto: i.nombre,
                            talle: talle,
                            cantidad: cantidad,
                            precio: precio == null ? i.precio : precio
                        };
                        let nuevaSuma = cantidad * (precio == null ? i.precio : precio);
                        sumaTotal = sumaTotal + nuevaSuma;
                        let nuevoStock = t.cantidad - cantidad;
                        yield t.update({ cantidad: nuevoStock });
                        let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                        yield orden_detalle.save()
                            .catch(err => {
                            return res.json({ ok: false, msg: err });
                        });
                    }
                }
            }
            else {
                let verdad = talles.some(k => k.id_producto == i.id);
                if (verdad == true) {
                    let conteo = 0;
                    for (let t of talles) {
                        yield t.update({ cantidad: t.cantidad - cantidad });
                        //conteo = cantidad + conteo;
                    }
                    let nuevaSuma = (cantidad * talles.length) * (precio == null ? i.precio : precio);
                    sumaTotal = sumaTotal + nuevaSuma;
                    let orden = {
                        id_orden: idOrden,
                        id_producto: i.id,
                        nombre_producto: i.nombre,
                        talle: i.talles,
                        cantidad: cantidad * talles.length,
                        precio: precio == null ? i.precio : precio
                    };
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                }
            }
        }
        for (let i of productos) {
            if (i.cantidad !== null) {
                if (talle == null) {
                    let cantidadDeTalle = i.talles.split(",").length;
                    let contadorTotal = cantidad * cantidadDeTalle;
                    /* for (let count of cantidadDeTalle){
                        contadorTotal += cantidad;
                    } */
                    let orden = {
                        id_orden: idOrden,
                        id_producto: i.id,
                        nombre_producto: i.nombre,
                        talle: i.talles,
                        cantidad: contadorTotal,
                        precio: precio == null ? i.precio : precio
                    };
                    let nuevaSuma = contadorTotal * (precio == null ? i.precio : precio);
                    sumaTotal = sumaTotal + nuevaSuma;
                    let nuevoStock = i.cantidad - contadorTotal;
                    yield i.update({ cantidad: nuevoStock });
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                }
                else {
                    let orden = {
                        id_orden: idOrden,
                        id_producto: i.id,
                        nombre_producto: i.nombre,
                        talle: talle,
                        cantidad: cantidad,
                        precio: precio == null ? i.precio : precio
                    };
                    let nuevaSuma = cantidad * (precio == null ? i.precio : precio);
                    sumaTotal = sumaTotal + nuevaSuma;
                    let nuevoStock = i.cantidad - cantidad;
                    yield i.update({ cantidad: nuevoStock });
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                }
            }
        }
        let ordenTotal = yield orden_1.Orden.findByPk(idOrden);
        yield (ordenTotal === null || ordenTotal === void 0 ? void 0 : ordenTotal.update({ total: ordenTotal.total + sumaTotal }));
        res.json({
            ok: true,
        });
    }
    catch (error) {
        res.json({ ok: false, msg: error });
    }
});
exports.agregarOrdenDetalle = agregarOrdenDetalle;
const deshacerOrdenDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrden, idDetalle } = req.params;
        let idetalle = idDetalle;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findByPk(idDetalle);
        let ids = [];
        /*  ordenDetalle.map( (e) => {
 
             ids.push(e.id_producto)
         }) */
        const productos = yield producto_1.Producto.findAll({ where: { id: ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto } });
        /*
                let ids_productos_total =  [];
                let ids_productos_unidad = [];
        
                for (let i of productos){
        
                    if( i.cantidad == null){
        
                        ids_productos_unidad.push(i.id);
        
                    }else{
        
                        ids_productos_total.push(i)
                    }
                }
         */
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto } });
        for (let i of productos) {
            let tallesFilter = talles.filter(h => h.id_producto == (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto));
            for (let h of tallesFilter) {
                let largo = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let largoDetalle = largo.length;
                if (largo.length == 1) {
                    if (h.talle == parseInt(ordenDetalle.talle)) {
                        let nuevaCantidad = h.cantidad + ordenDetalle.cantidad;
                        yield h.update({ cantidad: nuevaCantidad });
                        yield ordenDetalle.destroy();
                    }
                }
                else if (largo.length > 1) {
                    let filtrarTalles = talles.filter(h => h.id_producto == ordenDetalle.id_producto);
                    let calcularCantidadPorunidad = ordenDetalle.cantidad / filtrarTalles.length;
                    let nuevaCantidad = h.cantidad + calcularCantidadPorunidad;
                    yield h.update({ cantidad: nuevaCantidad });
                    yield ordenDetalle.destroy();
                }
                else {
                    return res.json({
                        ok: false,
                        msg: "Hablar con el administrador"
                    });
                }
            }
            let verdad = productos.some(e => e.cantidad !== null);
            if (verdad == true) {
                let largoTalle = ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.talle;
                let productoTotal = productos.find(p => p.id == (ordenDetalle === null || ordenDetalle === void 0 ? void 0 : ordenDetalle.id_producto));
                let nuevaCantidad = productoTotal.cantidad + ordenDetalle.cantidad;
                yield (productoTotal === null || productoTotal === void 0 ? void 0 : productoTotal.update({ cantidad: nuevaCantidad }));
                yield ordenDetalle.destroy();
            }
        }
        const orden = yield orden_1.Orden.findByPk(idOrden);
        /*  await orden?.destroy(); */
        yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: orden.total - (ordenDetalle.cantidad * ordenDetalle.precio) }));
        /*        Direccion.findByPk(orden?.id_direccion)
                       .then( async(resp) => {
                           if(resp){
                               await resp.destroy();
                           }
                       })
       
               const cliente = await Cliente.findByPk(orden?.id_cliente);
       
               await cliente?.destroy();
                */
        res.json({
            ok: true,
            orden
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.deshacerOrdenDetalle = deshacerOrdenDetalle;
//# sourceMappingURL=orden_detalle.js.map