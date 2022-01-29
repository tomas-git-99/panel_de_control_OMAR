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
exports.descontarProductosFull = exports.modificarOrden_detalle = exports.deshacerOrden = exports.generarOrdenPublico = exports.imptimirSoloVentas = exports.buscarPorID = exports.historialOrden = exports.ordenParaImprimir = exports.confirmarPedido = exports.buscarOrdenDNI = exports.buscarOrden = exports.confirmarCompra = exports.ordenDetalles = exports.generarOrden = void 0;
const dist_1 = require("sequelize/dist");
const carrito_1 = require("../../models/ventas/carrito");
const cliente_1 = require("../../models/ventas/cliente");
const direccion_1 = require("../../models/ventas/direccion");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const generarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCliente, idUsuario, idDireccion } = req.params;
        let { fecha, transporte } = req.body;
        if (fecha == '') {
            fecha = null;
        }
        if (transporte == '' || transporte == undefined) {
            transporte = null;
        }
        const datos = {
            id_cliente: idCliente,
            id_usuario: idUsuario,
            id_direccion: idDireccion,
            fecha,
            transporte
        };
        const orden = new orden_1.Orden(datos);
        yield orden.save();
        res.json({
            ok: true,
            orden
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: "Hablar con el administrador",
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
const ordenParaImprimir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const orden = yield orden_1.Orden.findByPk(id);
    const productos = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: id } });
    let ids = [];
    productos.map(e => {
        ids.push(e.id_producto);
    });
    const detalles_producto = yield producto_1.Producto.findAll({ where: { id: ids } });
    const direccion = yield direccion_1.Direccion.findByPk(orden === null || orden === void 0 ? void 0 : orden.id_direccion);
    const cliente = yield cliente_1.Cliente.findByPk(orden === null || orden === void 0 ? void 0 : orden.id_cliente);
    let para_mi = [];
    productos.map(e => {
        let data = detalles_producto.find(h => h.id == e.id_producto);
        para_mi = [...para_mi, { producto: data, detalles: e }];
    });
    console.log(id);
    res.json({
        ok: true,
        orden,
        cliente,
        direccion,
        productos,
        para_mi
    });
});
exports.ordenParaImprimir = ordenParaImprimir;
const historialOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const orden = await Orden.findAll({ limit: 10, order: [['updatedAt', 'DESC']]});
    try {
        const orden = yield orden_1.Orden.findAll({ where: { total: { [dist_1.Op.gt]: 0 } }, limit: 10, order: [['updatedAt', 'DESC']] });
        //const orden_publico = await Orden_publico.findAll({where:{ total:{ [Op.gt]: 0}},limit:10 , order: [['updatedAt', 'DESC']]});
        let id_cliente = [];
        let id_direccion = [];
        orden.map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
            id_cliente.push(e.id_cliente);
            id_direccion.push(e.id_direccion);
        }));
        /*         orden_publico.map(async(e, i)=> {
                    id_cliente.push(e.id_cliente);
                })
                 */
        const cliente = yield cliente_1.Cliente.findAll({ where: { id: id_cliente } });
        const direccion = yield direccion_1.Direccion.findAll({ where: { id: id_direccion } });
        let datos = [];
        for (let i of orden) {
            let newcliente = cliente.find(e => e.id == i.id_cliente);
            let direcciones = direccion.find(h => h.id == i.id_direccion);
            datos = [...datos, { orden: i, cliente: newcliente, direccion: direcciones || "" }];
        }
        /*    for( let i of orden_publico){
   
               let newcliente = cliente.find( e => e.id == i.id_cliente);
       
               datos = [...datos,{orden:i, cliente:newcliente,direccion:""}]
           }
    */
        res.json({
            datos
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
exports.historialOrden = historialOrden;
const buscarPorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clienteDNI = yield cliente_1.Cliente.findAll({ where: { dni_cuil: req.query.id }, order: [['updatedAt', 'DESC']] });
    let ids_clientesDNI = [];
    clienteDNI.forEach(e => {
        ids_clientesDNI.push(e.id);
    });
    const orden = yield orden_1.Orden.findAll({ where: { id_cliente: ids_clientesDNI, total: { [dist_1.Op.gt]: 0 } }, order: [['updatedAt', 'DESC']] });
    let id_cliente = [];
    let id_direccion = [];
    orden.map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
        id_cliente.push(e.id_cliente);
        id_direccion.push(e.id_direccion);
    }));
    const cliente = yield cliente_1.Cliente.findAll({ where: { id: id_cliente } });
    const direccion = yield direccion_1.Direccion.findAll({ where: { id: id_direccion } });
    let datos = [];
    cliente.map((e, i) => {
        orden.map((p, m) => {
            let direcciones = direccion.find(h => {
                if (h.id == p.id_direccion) {
                    return h;
                }
            });
            if (p.id_cliente == e.id) {
                datos = [...datos, { orden: orden[m], cliente: cliente[i], direccion: direcciones || "" }];
            }
        });
    });
    res.json({
        datos
    });
});
exports.buscarPorID = buscarPorID;
const imptimirSoloVentas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const orden_detalle_2 = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: id } });
    let id_productos = [];
    orden_detalle_2.map((e) => {
        id_productos.push(e.id_producto);
    });
    const productos = yield producto_1.Producto.findAll({ where: { id: id_productos }, attributes: ['id', 'tela'] });
    let orden_detalle = [];
    productos.map((e, i) => {
        orden_detalle_2.map((p, m) => {
            if (e.id == p.id_producto) {
                orden_detalle = [...orden_detalle, { orden_detalle: orden_detalle_2[m], productos: productos[i] }];
            }
        });
    });
    res.json({
        ok: true,
        orden_detalle
    });
});
exports.imptimirSoloVentas = imptimirSoloVentas;
const generarOrdenPublico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCliente, idUsuario } = req.params;
        const data = {
            id_cliente: idCliente,
            id_usuario: idUsuario
        };
        const orden = new orden_1.Orden(data);
        yield orden.save();
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
exports.generarOrdenPublico = generarOrdenPublico;
const deshacerOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrden } = req.params;
        const ordenDetalle = yield orden_detalle_1.OrdenDetalle.findAll({ where: { id_orden: idOrden } });
        let ids = [];
        ordenDetalle.map((e) => {
            ids.push(e.id_producto);
        });
        const productos = yield producto_1.Producto.findAll({ where: { id: ids } });
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
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos_unidad } });
        for (let i of ordenDetalle) {
            let tallesFilter = talles.filter(h => h.id_producto == i.id_producto);
            for (let h of tallesFilter) {
                let largo = i.talle;
                let largoDetalle = largo.length;
                if (largo.length == 1) {
                    if (h.talle == parseInt(i.talle)) {
                        let nuevaCantidad = h.cantidad + i.cantidad;
                        yield h.update({ cantidad: nuevaCantidad });
                        yield i.destroy();
                    }
                }
                else if (largo.length > 1) {
                    let filtrarTalles = talles.filter(h => h.id_producto == i.id_producto);
                    let calcularCantidadPorunidad = i.cantidad / filtrarTalles.length;
                    let nuevaCantidad = h.cantidad + calcularCantidadPorunidad;
                    yield h.update({ cantidad: nuevaCantidad });
                    yield i.destroy();
                }
                else {
                    return res.json({
                        ok: false,
                        msg: "Hablar con el administrador"
                    });
                }
            }
            let verdad = ids_productos_total.some(e => e.id == i.id_producto);
            if (verdad == true) {
                let largoTalle = i.talle;
                let productoTotal = productos.find(p => p.id == i.id_producto);
                let nuevaCantidad = productoTotal.cantidad + i.cantidad;
                yield (productoTotal === null || productoTotal === void 0 ? void 0 : productoTotal.update({ cantidad: nuevaCantidad }));
                yield i.destroy();
            }
        }
        const orden = yield orden_1.Orden.findByPk(idOrden);
        yield (orden === null || orden === void 0 ? void 0 : orden.destroy());
        direccion_1.Direccion.findByPk(orden === null || orden === void 0 ? void 0 : orden.id_direccion)
            .then((resp) => __awaiter(void 0, void 0, void 0, function* () {
            if (resp) {
                yield resp.destroy();
            }
        }));
        const cliente = yield cliente_1.Cliente.findByPk(orden === null || orden === void 0 ? void 0 : orden.id_cliente);
        yield (cliente === null || cliente === void 0 ? void 0 : cliente.destroy());
        res.json({
            ok: true
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.deshacerOrden = deshacerOrden;
const modificarOrden_detalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;
        const orden_detalle = yield orden_detalle_1.OrdenDetalle.findByPk(id);
        const producto = yield producto_1.Producto.findByPk(orden_detalle === null || orden_detalle === void 0 ? void 0 : orden_detalle.id_producto);
        if ((producto === null || producto === void 0 ? void 0 : producto.estado) == false) {
            return res.json({
                ok: false,
                msg: 'El producto ya no existe en el catalogo'
            });
        }
        let cantidadNumber = parseInt(cantidad);
        //Verificar si la cantidad que mandad es mayor o meno a la cantidad de la DB
        let newCantidad = 0;
        let cantidaParaProducto = 0;
        let cantidadOrden = 0;
        if ((orden_detalle === null || orden_detalle === void 0 ? void 0 : orden_detalle.cantidad) > cantidadNumber) {
            newCantidad = cantidadNumber - orden_detalle.cantidad;
            if (producto.cantidad < newCantidad) {
                return res.json({
                    ok: true,
                    msg: 'No ahi stock suficiente de este producto, stock actual del producto: ' + producto.cantidad
                });
            }
            cantidaParaProducto = producto.cantidad - newCantidad;
            cantidadOrden = orden_detalle.cantidad + newCantidad;
            if (orden_detalle.talle !== null) {
                let talle = yield talles_1.Talle.findByPk(orden_detalle.talle);
            }
        }
    }
    catch (error) {
    }
});
exports.modificarOrden_detalle = modificarOrden_detalle;
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
        // VERIFICAR SI TIENE STOCK SUFICIENTE EN LA BASE DE DATOSAAA
        let productos_sin_stock = [];
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos_unidad } });
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
        //VERIFICAR SI EN EL CARRIO AHI PRODUCTOS DUPLICADOS PARA LOS PRODUCTOS QUE NO ESTAN ACOMODADOS POR TALLE
        const miCarritoSinDuplicados = ids_productos_total.reduce((acumulador, valorActual) => {
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
        productos.map((e, i) => {
            ids_productos_total.map((p, c) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.descontarProductosFull = descontarProductosFull;
//# sourceMappingURL=orden.js.map