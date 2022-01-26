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
exports.eliminarProducto = exports.eliminarProductoDeEstampados = exports.agregarProductoAestampos = exports.buscar = exports.unicoDatoQuery = exports.ordenarPorFechaExacta = exports.ordenarPorRango = exports.obetenerUnProducto = exports.obtenerProduccion = exports.actualizarProducto = exports.crearProducto = void 0;
const dist_1 = require("sequelize/dist");
const estanpados_1 = require("../../models/produccion/estanpados");
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const talller_1 = require("../../models/produccion/talller");
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = new productos_produccion_1.Produccion_producto(req.body);
        const estado = req.query.estado;
        yield producto.save();
        if (estado == "true") {
            const data = {
                id_corte: req.body.id_corte
            };
            const estanpados = new estanpados_1.Estanpados(data);
            yield estanpados.save();
        }
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        });
    }
});
exports.crearProducto = crearProducto;
const actualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield productos_produccion_1.Produccion_producto.findByPk(id);
        let dato = req.body;
        const { estado } = req.body;
        let nombre = Object.keys(dato);
        if (nombre[0] == "total_por_talle") {
            let newTotal = producto.talles * dato.total_por_talle;
            yield (producto === null || producto === void 0 ? void 0 : producto.update({ total: newTotal }));
        }
        if (nombre[0] == "talles") {
            let newTotal = dato.talles * producto.total_por_talle;
            yield (producto === null || producto === void 0 ? void 0 : producto.update({ total: newTotal }));
        }
        if (estado == false) {
            let dato_verdad = null;
            yield (producto === null || producto === void 0 ? void 0 : producto.update({ fecha_de_pago: dato_verdad }));
        }
        yield (producto === null || producto === void 0 ? void 0 : producto.update(req.body));
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.actualizarProducto = actualizarProducto;
const obtenerProduccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  const produccion_productos = await Produccion_producto.findAll({order: [['updatedAt', 'DESC']], limit:10} ); */
    let valor = req.query.offset;
    let valorOffset = parseInt(valor);
    const produccion_test = yield productos_produccion_1.Produccion_producto.findAndCountAll({ order: [['createdAt', 'DESC']], limit: 10, offset: valorOffset });
    const taller = yield talller_1.Taller.findAll();
    let contador = produccion_test.count;
    let produccion = [];
    produccion_test.rows.map((e, i) => {
        taller.map((p, m) => {
            if (e.id_taller == p.id) {
                produccion = [...produccion, { produccion: e, taller: taller[m] }];
            }
        });
        if (e.id_taller === null) {
            produccion = [...produccion, { produccion: e }];
        }
    });
    res.json({
        ok: true,
        contador,
        produccion
    });
});
exports.obtenerProduccion = obtenerProduccion;
const obetenerUnProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productos = yield productos_produccion_1.Produccion_producto.findByPk(id);
    let taller = yield talller_1.Taller.findByPk(productos === null || productos === void 0 ? void 0 : productos.id_taller);
    let producto = [];
    producto = [...producto, { producto: productos, taller: taller || "" }];
    res.json({
        ok: true,
        producto,
        taller
    });
});
exports.obetenerUnProducto = obetenerUnProducto;
//["2021-12-12", "2021-12-11"]
const ordenarPorRango = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.body;
    const { query } = req.params;
    const { offset } = req.query;
    let valor = fecha;
    if (fecha !== undefined) {
        if (fecha.length > 1) {
            valor = { [dist_1.Op.between]: [fecha[0], fecha[1]] };
        }
    }
    else {
        valor = null;
        if (query == "estado") {
            valor = false;
        }
    }
    console.log(valor);
    searchFunc(query, valor, offset)
        .then(({ produccion, contador }) => {
        return res.json({
            ok: true,
            contador,
            produccion
        });
    })
        .catch(error => {
        return res.json({
            ok: false,
            msg: error
        });
    });
});
exports.ordenarPorRango = ordenarPorRango;
const ordenarPorFechaExacta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.body;
    const { query } = req.params;
    searchFunc(query, fecha)
        .then((produccion) => {
        return res.json({
            ok: true,
            produccion
        });
    })
        .catch(error => {
        return res.json({
            ok: false,
            msg: error
        });
    });
});
exports.ordenarPorFechaExacta = ordenarPorFechaExacta;
const unicoDatoQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        let valor = null;
        if (query == "estado") {
            valor = false;
        }
        const { offset } = req.query;
        searchFunc(query, valor, offset)
            .then((produccion) => {
            return res.json({
                ok: true,
                produccion
            });
        })
            .catch(error => {
            return res.json({
                ok: false,
                msg: error
            });
        });
    }
    catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        });
    }
});
exports.unicoDatoQuery = unicoDatoQuery;
const searchFunc = (palabra, valor, numero = 0) => __awaiter(void 0, void 0, void 0, function* () {
    let valorOffset = parseInt(numero);
    let buscar = {
        where: {}, order: [['createdAt', 'DESC']], limit: 10, offset: valorOffset
    };
    buscar.where[`${palabra}`] = valor;
    const produccion_productos = yield productos_produccion_1.Produccion_producto.findAndCountAll(buscar);
    const taller = yield talller_1.Taller.findAll();
    let produccion = [];
    produccion_productos.rows.map((e, i) => {
        taller.map((p, m) => {
            if (e.id_taller == p.id) {
                produccion = [...produccion, { produccion: e, taller: taller[m] }];
            }
        });
        if (e.id_taller === null) {
            produccion = [...produccion, { produccion: e }];
        }
    });
    return { produccion, contador: produccion_productos.count };
});
const buscar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  const dato = req.query; */
    let valor = req.query.offset;
    let valorOffset = parseInt(valor);
    const produccion_productos = yield productos_produccion_1.Produccion_producto.findAndCountAll({ where: {
            id_corte: { [dist_1.Op.like]: '%' + req.query.nombre + '%' },
        }, limit: 10, offset: valorOffset });
    let contador = produccion_productos.count;
    const taller = yield talller_1.Taller.findAll();
    let produccion = [];
    produccion_productos.rows.map((e, i) => {
        taller.map((p, m) => {
            if (e.id_taller == p.id) {
                produccion = [...produccion, { produccion: e, taller: taller[m] }];
            }
        });
        if (e.id_taller === null) {
            produccion = [...produccion, { produccion: e }];
        }
    });
    res.json({
        ok: true,
        contador,
        produccion
    });
});
exports.buscar = buscar;
const agregarProductoAestampos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield productos_produccion_1.Produccion_producto.findByPk(id);
        const estampdos = yield estanpados_1.Estanpados.findAll({ where: { id_corte: producto === null || producto === void 0 ? void 0 : producto.id_corte } });
        if (estampdos.length > 0) {
            return res.json({
                ok: false,
                msg: `El producto "${producto === null || producto === void 0 ? void 0 : producto.nombre}" ya esta agregado en Estampados`
            });
        }
        const data = {
            id_corte: producto === null || producto === void 0 ? void 0 : producto.id_corte
        };
        const estanpados = new estanpados_1.Estanpados(data);
        yield estanpados.save();
        res.json({
            ok: true,
            estanpados
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.agregarProductoAestampos = agregarProductoAestampos;
const eliminarProductoDeEstampados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield productos_produccion_1.Produccion_producto.findByPk(id);
        const estampdos = yield estanpados_1.Estanpados.findAll({ where: { id_corte: producto === null || producto === void 0 ? void 0 : producto.id_corte } });
        if (estampdos.length == 0) {
            return res.json({
                ok: false,
                msg: "El producto que quiere elimnar no esta en estampados"
            });
        }
        yield estampdos[0].destroy();
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
exports.eliminarProductoDeEstampados = eliminarProductoDeEstampados;
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield productos_produccion_1.Produccion_producto.findByPk(id);
        const estampdos = yield estanpados_1.Estanpados.findAll({ where: { id_corte: producto === null || producto === void 0 ? void 0 : producto.id_corte } });
        if (estampdos.length > 0) {
            yield estampdos[0].destroy();
        }
        yield (producto === null || producto === void 0 ? void 0 : producto.destroy());
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
exports.eliminarProducto = eliminarProducto;
//# sourceMappingURL=producto.js.map