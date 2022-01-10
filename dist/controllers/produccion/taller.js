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
exports.buscarSoloPortaller = exports.buscarUnicTaller = exports.obtenerTaller = exports.eliminarTaller = exports.actualizarTaller = exports.crearTaller = void 0;
const dist_1 = require("sequelize/dist");
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const talller_1 = require("../../models/produccion/talller");
const crearTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taller = new talller_1.Taller(req.body);
    yield taller.save();
    res.json({
        ok: true,
        taller
    });
});
exports.crearTaller = crearTaller;
const actualizarTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const taller = yield talller_1.Taller.findByPk(id);
    yield (taller === null || taller === void 0 ? void 0 : taller.update(req.body));
    res.json({
        ok: true,
        taller
    });
});
exports.actualizarTaller = actualizarTaller;
const eliminarTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const taller = yield talller_1.Taller.findByPk(id);
    taller === null || taller === void 0 ? void 0 : taller.destroy();
    res.json({
        ok: true,
        msg: "el taller fue eliminado con exito"
    });
});
exports.eliminarTaller = eliminarTaller;
const obtenerTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taller = yield talller_1.Taller.findAll();
    res.json({
        ok: true,
        taller
    });
});
exports.obtenerTaller = obtenerTaller;
const buscarUnicTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taller = yield talller_1.Taller.findAll({ where: { nombre_completo: { [dist_1.Op.like]: '%' + req.query.nombre + '%' } } });
        res.json({ ok: true, taller });
    }
    catch (error) {
        res.json({ ok: false, msg: error });
    }
});
exports.buscarUnicTaller = buscarUnicTaller;
const buscarSoloPortaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const produccion_productos = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_taller: id } });
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
exports.buscarSoloPortaller = buscarSoloPortaller;
//# sourceMappingURL=taller.js.map