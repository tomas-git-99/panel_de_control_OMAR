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
exports.nuevaFuncionParaDescontar = exports.pruebaParaDescontar = exports.descontarProductosFull = exports.mostrarCantidad_Actual_Carrito = exports.modificarCarrito = exports.descontarElTotal = exports.descontarPorUnidad = exports.eliminarCarrito = exports.mostrarCarrito = exports.agregarCarrito = void 0;
const dist_1 = require("sequelize/dist");
const descontar_carrito_func_1 = require("../../helpers/descontar_carrito_func");
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
                let nuevaCantidad = cantidadBody + e.cantidad;
                yield e.update({ cantidad: nuevaCantidad });
                return res.json({
                    ok: true,
                });
            }
        }
        if (req.body.talle == null || req.body.talle == undefined) {
            for (let e of verificar) {
                if (e.talle == null) {
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
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: idProductos } });
        carrito.map((e, i) => {
            productos.find((r, s) => {
                if (r.id == e.id_producto) {
                    let count = talles.filter(o => o.id_producto == e.id_producto ? o : "");
                    carrito_full = [...carrito_full, { carritos: carrito[i], productos: productos[s], talles: count }];
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
        let talleProducto = [];
        carrito.map(e => {
            idProductos.push(e.id_producto);
            talleProducto.push(e.talle);
        });
        const talle = yield talles_1.Talle.findAll({ where: { id_producto: idProductos } });
        const productos = yield producto_1.Producto.findAll({ where: { id: idProductos } });
        let productos_sin_stock = [];
        let stockDisponible = talle.map(e => {
            carrito.map(p => {
                if (p.id_producto == e.id_producto) {
                    if (p.talle == e.talle) {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            //let nombre_producto:any = productos.map( n => n.id == e.id_producto ?? n);
                            let dato_producto = productos.find(e => e.id == p.id_producto);
                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
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
        for (let e of talle) {
            for (let n of carrito) {
                if (e.id_producto == n.id_producto) {
                    if (e.talle == n.talle) {
                        let dato_producto = productos.find(e => e.id == n.id_producto);
                        let orden = {
                            id_orden,
                            id_producto: n.id_producto,
                            nombre_producto: dato_producto.nombre,
                            talle: n.talle,
                            cantidad: n.cantidad,
                            precio: dato_producto.precio
                        };
                        let nuevaSuma = n.cantidad * dato_producto.precio;
                        sumaTotal += sumaTotal + nuevaSuma;
                        let nuevoStock = e.cantidad - n.cantidad;
                        yield e.update({ cantidad: nuevoStock })
                            .catch(err => {
                            return res.json({ ok: false, msg: err });
                        });
                        let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                        yield orden_detalle.save()
                            .catch(err => {
                            return res.json({ ok: false, msg: err });
                        });
                        yield n.destroy();
                    }
                }
            }
        }
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
                    sumaTotal += nuevaSuma;
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
    res.json({
        ok: true,
        carrito
    });
});
exports.modificarCarrito = modificarCarrito;
const mostrarCantidad_Actual_Carrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const carrito = yield carrito_1.Carrito.findByPk(id);
    const producto = yield producto_1.Producto.findByPk(carrito === null || carrito === void 0 ? void 0 : carrito.id_producto);
    const talle = yield talles_1.Talle.findAll({ where: { id_producto: producto === null || producto === void 0 ? void 0 : producto.id } });
    let cantidadActual = 0;
    if ((producto === null || producto === void 0 ? void 0 : producto.cantidad) == null) {
        for (let i of talle) {
            cantidadActual += i.cantidad;
        }
    }
    else {
        cantidadActual = producto === null || producto === void 0 ? void 0 : producto.cantidad;
    }
    const precio = (carrito === null || carrito === void 0 ? void 0 : carrito.precio_nuevo) == null ? producto === null || producto === void 0 ? void 0 : producto.precio : carrito.precio_nuevo;
    let cantidadCarrito;
    if ((carrito === null || carrito === void 0 ? void 0 : carrito.talle) == null) {
        cantidadCarrito = (carrito === null || carrito === void 0 ? void 0 : carrito.cantidad) + " (Por talle)";
    }
    else {
        cantidadCarrito = carrito === null || carrito === void 0 ? void 0 : carrito.cantidad;
    }
    res.json({
        ok: true,
        cantidadActual,
        cantidadCarrito,
        precio
    });
});
exports.mostrarCantidad_Actual_Carrito = mostrarCantidad_Actual_Carrito;
const descontarProductosFull = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //RECIVIMOS EL ID DEL USUARIO PARA DESCONTAR
        const { id, id_orden } = req.params;
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let ids_productos = [];
        let sumaTotal = 0;
        carrito.map(e => {
            ids_productos.push(e.id_producto);
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: ids_productos } });
        //VERIFICAMOS SI EL PRODUCTO ES PARA DESCONTAR POR TALLE O EL TOTAL
        let ids_productos_total = [];
        let ids_productos_unidad = [];
        for (let i of productos) {
            if (i.cantidad == null) {
                ids_productos_unidad.push(i.id);
            }
            else {
                ids_productos_total.push(i);
            }
        }
        /*         console.log(ids_productos_total);
                console.log(ids_productos_unidad);
        
        
                let valor = ids_productos_total.some((h:any) => h == 2);
        
                console.log(valor);
         */
        // VERIFICAR SI TIENE STOCK SUFICIENTE EN LA BASE DE DATOSAAA
        let productos_sin_stock = [];
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos_unidad } });
        res.json({
            carrito
        });
        talles.map(e => {
            carrito.map(p => {
                if (p.id_producto == e.id_producto) {
                    if (p.talle == e.talle) {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            //let nombre_producto:any = productos.map( n => n.id == e.id_producto ?? n);
                            let dato_producto = productos.find(e => e.id == p.id_producto);
                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                        }
                    }
                }
            });
        });
        let verificar_si_estaRepetido = [];
        carrito.map(e => {
            ids_productos_total.map((i) => {
                if (e.id_producto == i.id) {
                    verificar_si_estaRepetido = [...verificar_si_estaRepetido, { id_producto: e.id_producto, cantidad: e.cantidad }];
                }
            });
        });
        //VERIFICAR SI EN EL CARRIO AHI PRODUCTOS DUPLICADOS PARA LOS PRODUCTOS QUE NO ESTAN ACOMODADOS POR TALLE
        const miCarritoSinDuplicados = verificar_si_estaRepetido.reduce((acumulador, valorActual) => {
            const elementoYaExiste = acumulador.find((elemento) => elemento.id_producto === valorActual.id_producto);
            if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                    if (elemento.id_producto === valorActual.id_producto) {
                        return Object.assign(Object.assign({}, elemento), { cantidad: elemento.cantidad + valorActual.cantidad });
                    }
                    return elemento;
                });
            }
            return [...acumulador, valorActual];
        }, []);
        productos.map(e => {
            miCarritoSinDuplicados.map((p) => {
                if (e.id == p.id_producto) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                    }
                }
            });
        });
        //ALERTA DE STOCK
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                error: 2,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        for (let e of talles) {
            for (let n of carrito) {
                if (e.id_producto == n.id_producto) {
                    if (e.talle == n.talle) {
                        let dato_producto = productos.find(e => e.id == n.id_producto);
                        let orden = {
                            id_orden,
                            id_producto: n.id_producto,
                            nombre_producto: dato_producto.nombre,
                            talle: n.talle,
                            cantidad: n.cantidad,
                            precio: dato_producto.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                        };
                        let nuevaSuma = n.cantidad * dato_producto.precio;
                        sumaTotal = sumaTotal + nuevaSuma;
                        let nuevoStock = e.cantidad - n.cantidad;
                        /*   await e.update({cantidad:nuevoStock})
                                      .catch(err => {
                                          return res.json({ok: false, msg: err})
                                      });
                          let orden_detalle = new OrdenDetalle(orden);
  
                          await orden_detalle.save()
                                  .catch(err => {
                                      return res.json({ok: false, msg: err})
                                  });
      
                          await n.destroy().catch( err => {
                              return res.json({ok: false, msg: err})
                          })
                           */
                    }
                    else if (n.talle == null) {
                        let filtroDeTalles = talles.filter(p => p.id_producto == n.id_producto);
                        let dato_producto = productos.find(j => j.id == n.id_producto);
                        let canitdadTotalTalle = 0;
                        for (let f of filtroDeTalles) {
                            canitdadTotalTalle += n.cantidad;
                            let nuevaSuma = n.cantidad * dato_producto.precio;
                            sumaTotal = sumaTotal + nuevaSuma;
                            let nuevoStock = e.cantidad - n.cantidad;
                            /*          await f.update({cantidad:nuevoStock})
                                     .catch(err => {
                                         return res.json({ok: false, msg: err})
                                     }); */
                        }
                        let orden = {
                            id_orden,
                            id_producto: n.id_producto,
                            nombre_producto: dato_producto.nombre,
                            talle: dato_producto.talles,
                            cantidad: canitdadTotalTalle,
                            precio: dato_producto.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                        };
                        /*     let orden_detalle = new OrdenDetalle(orden);
    
                            await orden_detalle.save()
                                    .catch(err => {
                                        return res.json({ok: false, msg: err})
                                    });
        
                            await n.destroy().catch( err => {
                                return res.json({ok: false, msg: err})
                            })
     */
                    }
                }
            }
        }
        for (let p of carrito) {
            let valor = ids_productos_total.filter((h) => h.id == p.id_producto);
            let valor_true = ids_productos_total.some((h) => h.id == p.id_producto);
            if (valor_true) {
                let producto = productos.filter(e => e.id == valor[0].id);
                if (producto.length > 0) {
                    let orden = {
                        id_orden,
                        id_producto: p.id_producto,
                        nombre_producto: producto[0].nombre,
                        talle: p.talle,
                        cantidad: p.cantidad,
                        precio: producto[0].precio
                    };
                    let nuevaSuma = p.cantidad * producto[0].precio;
                    sumaTotal = sumaTotal + nuevaSuma;
                    let nuevoStock = producto[0].cantidad - p.cantidad;
                    /*    await producto[0].update({cantidad: nuevoStock})
                           .catch(err => {
                               return res.json({ok: false, msg: err})
                           });
       
                       let orden_detalle = new OrdenDetalle(orden);
                       await orden_detalle.save()
                           .catch(err => {
                               return res.json({ok: false, msg: err})
                           });
   
                      
       
                       await p.destroy(); */
                }
            }
        }
        /*
                const orden = await Orden.findByPk(id_orden);
                await orden!.update({total:sumaTotal}); */
        /* res.json({
            ok: true,
            msg: "Su compra fue exitosa"
         })
 */
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
});
exports.descontarProductosFull = descontarProductosFull;
const pruebaParaDescontar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, id_orden } = req.params;
        //BUSCANDO LOS PROUDCTOS DEL CARRITO DEL USUARIO
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let ids_productos = [];
        let sumaTotal = 0;
        carrito.map(e => {
            ids_productos.push(e.id_producto);
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: ids_productos } });
        //FILTRAR LOS CARRITOS POR TALLES O CANTIDADES
        //EL PRODUCTO QUE VIENE CON SOLO CANTIDAD TOTAL 
        let ids_productos_total = [];
        //EL PRODUCTO VIENE CON TALLES Y CANTIDAD INDIVIDUAL
        let ids_productos_unidad = [];
        for (let i of productos) {
            if (i.cantidad == null) {
                ids_productos_unidad.push(i.id);
            }
            else {
                ids_productos_total.push(i);
            }
        }
        let productos_sin_stock = [];
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos_unidad } });
        talles.map(e => {
            carrito.map(p => {
                if (p.id_producto == e.id_producto) {
                    if (p.talle == e.talle) {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            let dato_producto = productos.find(e => e.id == p.id_producto);
                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                        }
                    }
                    else if (p.talle == null) {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            let dato_producto = productos.find(e => e.id == p.id_producto);
                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                        }
                    }
                }
            });
        });
        let verificar_si_estaRepetido = [];
        carrito.map(e => {
            ids_productos_total.map((i) => {
                if (e.id_producto == i.id) {
                    verificar_si_estaRepetido = [...verificar_si_estaRepetido, { id_producto: e.id_producto, cantidad: e.cantidad, talle: e.talle }];
                }
            });
        });
        const miCarritoSinDuplicados = verificar_si_estaRepetido.reduce((acumulador, valorActual) => {
            const elementoYaExiste = acumulador.find((elemento) => elemento.id_producto === valorActual.id_producto && elemento.talle !== null);
            if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                    if (elemento.id_producto === valorActual.id_producto && elemento.talle !== null) {
                        return Object.assign(Object.assign({}, elemento), { cantidad: elemento.cantidad + valorActual.cantidad });
                    }
                    return elemento;
                });
            }
            return [...acumulador, valorActual];
        }, []);
        productos.map(e => {
            miCarritoSinDuplicados.map((p) => {
                if (e.id == p.id_producto) {
                    if (p.talle == null) {
                        let cantidadDeTalle = e.talles.split(",");
                        let contador = 0;
                        for (let count of cantidadDeTalle) {
                            contador += p.cantidad;
                        }
                        if (e.cantidad < contador || e.cantidad == 0) {
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito(curva): ${contador} `);
                        }
                    }
                    else {
                        if (e.cantidad < p.cantidad || e.cantidad == 0) {
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                        }
                    }
                }
            });
        });
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                error: 2,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        //DESCONTAR POR TALLES Y CANTIDAD INDIVIDUAL
        for (let i of carrito) {
            let carritoComprobar = productos.some(h => {
                if (h.id == i.id_producto)
                    return i.talle == null ? false : true;
            });
            //DESCONTAR POR TALLE
            if (carritoComprobar == true) {
                let tallesPrueba = talles.filter(p => p.id_producto == i.id_producto ? p : undefined);
                for (let t of tallesPrueba) {
                    /*   for( let ca of carritoNoCurva){ */
                    if (i.talle == t.talle) {
                        /*   let carritoNoCurva = carrito.filter( h => h.id_producto == i.id_producto ?? h); */
                        let carritoCurva = carrito.find(t => t.id_producto == i.id_producto);
                        let dato_producto = productos.find(e => e.id == i.id_producto);
                        let orden = {
                            id_orden,
                            id_producto: i.id_producto,
                            nombre_producto: dato_producto.nombre,
                            talle: i.talle,
                            cantidad: i.cantidad,
                            precio: i.precio_nuevo == null ? dato_producto.precio : i.precio_nuevo //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                        };
                        let precioNuevo = i.precio_nuevo == null ? dato_producto.precio : i.precio_nuevo;
                        let nuevaSuma = i.cantidad * precioNuevo;
                        sumaTotal = sumaTotal + nuevaSuma;
                        let nuevoStock = t.cantidad - i.cantidad;
                        yield t.update({ cantidad: nuevoStock });
                        let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                        yield orden_detalle.save()
                            .catch(err => {
                            return res.json({ ok: false, msg: err });
                        });
                        yield i.destroy();
                    }
                    /*   } */
                }
            }
            else {
                let verdad = talles.some(k => k.id_producto == i.id_producto);
                if (verdad == true) {
                    let productoData = productos.find(p => p.id == i.id_producto);
                    let tallesUnicoCurva = talles.filter(t => t.id_producto == i.id_producto);
                    let carritoCurva = carrito.find(t => t.id_producto == i.id_producto);
                    let conteo = 0;
                    for (let o of tallesUnicoCurva) {
                        let precioNuevo = carritoCurva.precio_nuevo == null ? productoData.precio : carritoCurva.precio_nuevo;
                        let nuevaSuma = i.cantidad * precioNuevo;
                        sumaTotal = sumaTotal + nuevaSuma;
                        let nuevoStock = o.cantidad - i.cantidad;
                        yield o.update({ cantidad: o.cantidad - i.cantidad });
                        conteo += i.cantidad;
                    }
                    let orden = {
                        id_orden,
                        id_producto: i.id_producto,
                        nombre_producto: productoData.nombre,
                        talle: productoData.talles,
                        cantidad: conteo,
                        precio: i.precio_nuevo == null ? productoData.precio : i.precio_nuevo //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                    };
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    yield (i === null || i === void 0 ? void 0 : i.destroy());
                }
            }
        }
        //FILTRAR LOS PRODUCTOS DE SOLO POR CANTIDAD TOTAL 
        for (let c of ids_productos_total) {
            let carritoCurva = carrito.filter(e => e.id_producto == c.id ? e : undefined);
            for (let i of carritoCurva) {
                if (i.talle == null) {
                    let productoCurva = productos.find(o => o.id == i.id_producto ? o : undefined);
                    let cantidadDeTalle = productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.talles.split(",");
                    let contadorTotal = 0;
                    let carritoCurva = carrito.find(t => t.id_producto == i.id_producto);
                    for (let count of cantidadDeTalle) {
                        contadorTotal += i.cantidad;
                    }
                    let orden = {
                        id_orden,
                        id_producto: productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.id,
                        nombre_producto: productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.nombre,
                        talle: productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.talles,
                        cantidad: contadorTotal,
                        precio: i.precio_nuevo == null ? productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.precio : i.precio_nuevo
                    };
                    let precioNuevo = i.precio_nuevo == null ? productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.precio : i.precio_nuevo;
                    let nuevaSuma = contadorTotal * precioNuevo;
                    sumaTotal = sumaTotal + nuevaSuma;
                    let nuevoStock = productoCurva.cantidad - contadorTotal;
                    yield (productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.update({ cantidad: nuevoStock }));
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    yield i.destroy();
                }
                else {
                    let productoCurva = productos.find(o => o.id == i.id_producto ? o : undefined);
                    let carritoCurva = carrito.find(t => t.id_producto == i.id_producto);
                    let orden = {
                        id_orden,
                        id_producto: i.id_producto,
                        nombre_producto: productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.nombre,
                        talle: i.talle,
                        cantidad: i.cantidad,
                        precio: i.precio_nuevo == null ? productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.precio : i.precio_nuevo
                    };
                    let precioNuevo = i.precio_nuevo == null ? productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.precio : i.precio_nuevo;
                    let nuevaSuma = i.cantidad * precioNuevo;
                    sumaTotal = sumaTotal + nuevaSuma;
                    let nuevoStock = productoCurva.cantidad - i.cantidad;
                    yield (productoCurva === null || productoCurva === void 0 ? void 0 : productoCurva.update({ cantidad: nuevoStock }));
                    let orden_detalle = new orden_detalle_1.OrdenDetalle(orden);
                    yield orden_detalle.save()
                        .catch(err => {
                        return res.json({ ok: false, msg: err });
                    });
                    yield (i === null || i === void 0 ? void 0 : i.destroy());
                    /*       await i.destroy(); */
                }
            }
        }
        const orden = yield orden_1.Orden.findByPk(id_orden);
        yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: sumaTotal }));
        /*         await new Promise( (resolve, reject) => {
                })
                
         */
        return res.json({ ok: true, msg: 'Su compra fue exitosa', total: sumaTotal });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
});
exports.pruebaParaDescontar = pruebaParaDescontar;
const nuevaFuncionParaDescontar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, id_orden } = req.params;
        //BUSCANDO LOS PROUDCTOS DEL CARRITO DEL USUARIO
        const carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
        let ids_productos = [];
        let sumaTotal = 0;
        carrito.map(e => {
            ids_productos.push(e.id_producto);
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: ids_productos } });
        //FILTRAR LOS CARRITOS POR TALLES O CANTIDADES
        //EL PRODUCTO QUE VIENE CON SOLO CANTIDAD TOTAL 
        let ids_productos_total = [];
        //EL PRODUCTO VIENE CON TALLES Y CANTIDAD INDIVIDUAL
        let ids_productos_unidad = [];
        for (let i of productos) {
            if (i.cantidad === null) {
                ids_productos_unidad.push(i.id);
            }
            else {
                ids_productos_total.push(i.id);
            }
        }
        let curvasDeTotal = descontar_carrito_func_1.unirCurvasOUnidadTotal(ids_productos_total, carrito, productos);
        let verificarStockProducto = descontar_carrito_func_1.repeticionDeProductos(curvasDeTotal);
        let curvasCompletasTotal = descontar_carrito_func_1.unirPortalleParaOrdenDetallada(curvasDeTotal, ids_productos_total, productos, carrito);
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos_unidad } });
        let tallesCompletados = descontar_carrito_func_1.armarLasCurvas(carrito, talles).filter(a => ids_productos_unidad.includes(a.id_producto));
        let tallesPorSeparado = descontar_carrito_func_1.juntarTodosLosTallesEnUno(ids_productos_unidad, tallesCompletados);
        let sumaDeTodasLasTalles = descontar_carrito_func_1.sumaDeTodoLosProductos(tallesPorSeparado, tallesCompletados);
        //verificamos el stock de los productos
        let productos_sin_stock = [].concat(descontar_carrito_func_1.verifcarSiTienenStock(talles, sumaDeTodasLasTalles, productos), descontar_carrito_func_1.verificarSiHayStockTotal(verificarStockProducto, productos));
        if (productos_sin_stock.length > 0) {
            return res.json({
                ok: false,
                error: 2,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            });
        }
        //crear orden detalle, de los productos que tiene solo talles
        let totasLasOrdenes = yield descontar_carrito_func_1.creandoOrdenDetallePorTalle(sumaDeTodasLasTalles, talles, carrito, productos, id_orden);
        //crear orden detalle, de los productos que tiene solo total
        let totalDeOrdenSoloTOTAL = yield descontar_carrito_func_1.crearOrdenDetalleTotal(parseInt(id_orden), curvasCompletasTotal, productos, carrito);
        for (let i of totasLasOrdenes) {
            let talleCambiar = talles.find(t => t.id_producto == i.id_producto && t.talle == parseInt(i.talle));
            sumaTotal += i.cantidad * i.precio;
            yield talleCambiar.update({ cantidad: talleCambiar.cantidad - i.cantidad });
        }
        for (let p of verificarStockProducto) {
            let productoCambiar = productos.find(t => t.id == p.id_producto);
            let ordenDetalleTOTAL = totalDeOrdenSoloTOTAL.find(u => u.id_producto == p.id_producto);
            sumaTotal += p.cantidad * ordenDetalleTOTAL.precio;
            yield productoCambiar.update({ cantidad: productoCambiar.cantidad - p.cantidad });
        }
        yield carrito_1.Carrito.destroy({ where: { id_usuario: id } });
        const orden = yield orden_1.Orden.findByPk(id_orden);
        yield (orden === null || orden === void 0 ? void 0 : orden.update({ total: sumaTotal }));
        res.json({
            ok: true,
            msg: "Su compra fue exitosa",
            sumaTotal
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
});
exports.nuevaFuncionParaDescontar = nuevaFuncionParaDescontar;
//# sourceMappingURL=carrito.js.map