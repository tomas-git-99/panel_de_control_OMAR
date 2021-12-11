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
exports.ordenarPorFechaExacta = exports.ordenarPorRango = exports.obetenerUnProducto = exports.obtenerProduccion = exports.actualizarProducto = exports.crearProducto = void 0;
const dist_1 = require("sequelize/dist");
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const talller_1 = require("../../models/produccion/talller");
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = new productos_produccion_1.Produccion_producto(req.body);
        yield producto.save();
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
    const { id } = req.params;
    const producto = yield productos_produccion_1.Produccion_producto.findByPk(id);
    let dato = req.body;
    let nombre = Object.keys(dato);
    if (nombre[0] == "total_por_talle") {
        let newTotal = producto.talles * dato.total_por_talle;
        yield (producto === null || producto === void 0 ? void 0 : producto.update({ total: newTotal }));
    }
    if (nombre[0] == "talles") {
        let newTotal = dato.talles * producto.total_por_talle;
        yield (producto === null || producto === void 0 ? void 0 : producto.update({ total: newTotal }));
    }
    yield (producto === null || producto === void 0 ? void 0 : producto.update(req.body));
    res.json({
        ok: true,
        producto
    });
});
exports.actualizarProducto = actualizarProducto;
const obtenerProduccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const produccion_productos = yield productos_produccion_1.Produccion_producto.findAll();
    const taller = yield talller_1.Taller.findAll();
    let produccion = [];
    produccion_productos.map((e, i) => {
        taller.map((p, m) => {
            if (e.id_taller == p.id) {
                produccion = [...produccion, { produccion: produccion_productos[i], taller: taller[m] }];
            }
        });
        if (e.id_taller === null) {
            produccion = [...produccion, { produccion: produccion_productos[i] }];
        }
    });
    res.json({
        ok: true,
        produccion
    });
});
exports.obtenerProduccion = obtenerProduccion;
const obetenerUnProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productos = yield productos_produccion_1.Produccion_producto.findByPk(id);
    let taller;
    let producto = [];
    if (!(productos === null || productos === void 0 ? void 0 : productos.id_taller) == null || !(productos === null || productos === void 0 ? void 0 : productos.id_taller) == undefined) {
        taller = yield talller_1.Taller.findByPk(productos === null || productos === void 0 ? void 0 : productos.id_taller);
    }
    producto = [...producto, { producto: productos, taller: taller }];
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
    console.log(fecha);
    if (query == "fecha_de_entrada") {
        const produccion_productos = yield productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_entrada: { [dist_1.Op.between]: [fecha[0], fecha[1]] }
            }, order: [['updatedAt', 'ASC']]
        });
        const taller = yield talller_1.Taller.findAll();
        let produccion = [];
        produccion_productos.map((e, i) => {
            taller.map((p, m) => {
                if (e.id_taller == p.id) {
                    produccion = [...produccion, { produccion: produccion_productos[i], taller: taller[m] }];
                }
            });
            if (e.id_taller === null) {
                produccion = [...produccion, { produccion: produccion_productos[i] }];
            }
        });
        return res.json({
            ok: true,
            produccion
        });
    }
    else if (query == "fecha_de_salida") {
        productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_salida: { [dist_1.Op.between]: [fecha[0], fecha[1]] }
            }, order: [['updatedAt', 'ASC']]
        })
            .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                msg: err
            });
        });
    }
    else if (query == "fecha_de_pago") {
        productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_salida: { [dist_1.Op.between]: [fecha[0], fecha[1]] }
            }, order: [['updatedAt', 'ASC']]
        })
            .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                msg: err
            });
        });
    }
});
exports.ordenarPorRango = ordenarPorRango;
const ordenarPorFechaExacta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.body;
    const { query } = req.params;
    if (query == "fecha_de_entrada") {
        productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_entrada: { fecha }
            }, order: [['updatedAt', 'ASC']]
        })
            .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                msg: err
            });
        });
    }
    else if (query == "fecha_de_salida") {
        productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_salida: { fecha }
            }, order: [['updatedAt', 'ASC']]
        })
            .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                msg: err
            });
        });
    }
    else if (query == "fecha_de_pago") {
        productos_produccion_1.Produccion_producto.findAll({
            where: {
                fecha_de_salida: { fecha }
            }, order: [['updatedAt', 'ASC']]
        })
            .then(productos => {
            res.json({
                ok: true,
                productos
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                msg: err
            });
        });
    }
});
exports.ordenarPorFechaExacta = ordenarPorFechaExacta;
//# sourceMappingURL=producto.js.map