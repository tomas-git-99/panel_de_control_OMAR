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
exports.deshacerOrden = exports.generarOrdenPublico = exports.imptimirSoloVentas = exports.buscarPorID = exports.historialOrden = exports.ordenParaImprimir = exports.confirmarPedido = exports.buscarOrdenDNI = exports.buscarOrden = exports.confirmarCompra = exports.ordenDetalles = exports.generarOrden = void 0;
const dist_1 = require("sequelize/dist");
const cliente_1 = require("../../models/ventas/cliente");
const direccion_1 = require("../../models/ventas/direccion");
const orden_1 = require("../../models/ventas/orden");
const orden_detalle_1 = require("../../models/ventas/orden_detalle");
const producto_1 = require("../../models/ventas/producto");
const generarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCliente, idUsuario, idDireccion } = req.params;
        const { fecha, transporte } = req.body;
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
        console.log(error);
        res.status(500).json({
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
        for (let i of ordenDetalle) {
            for (let e of productos) {
                if (e.id == i.id_producto) {
                    let nuevoStock = e.cantidad + i.cantidad;
                    yield e.update({ cantidad: nuevoStock });
                    yield i.destroy();
                }
            }
        }
        const orden = yield orden_1.Orden.findByPk(idOrden);
        yield (orden === null || orden === void 0 ? void 0 : orden.destroy());
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
//# sourceMappingURL=orden.js.map