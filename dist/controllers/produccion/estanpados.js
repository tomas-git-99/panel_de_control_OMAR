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
exports.nuevoEstanpador = exports.getEstanpadores = exports.cambiarEstanpado = exports.obtenerEstanpados = void 0;
const estanpador_1 = require("../../models/produccion/estanpador");
const estanpados_1 = require("../../models/produccion/estanpados");
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const obtenerEstanpados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const estanpado = yield estanpados_1.Estanpados.findAll();
    let ids = [];
    estanpado.map(e => {
        ids.push(e.id_corte);
    });
    const producto = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_corte: ids } });
    let data = [];
    producto.map(e => {
        estanpado.map(i => {
            if (e.id_corte == i.id_corte) {
                data = [...data, { producto: e, estanpado: i }];
            }
        });
    });
    res.json({
        ok: true,
        data
    });
});
exports.obtenerEstanpados = obtenerEstanpados;
const cambiarEstanpado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const producto = yield estanpados_1.Estanpados.findByPk(id);
    yield (producto === null || producto === void 0 ? void 0 : producto.update(req.body));
    res.json({
        ok: true
    });
});
exports.cambiarEstanpado = cambiarEstanpado;
const getEstanpadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const estanpador = yield estanpador_1.Estanpador.findAll();
    res.json({
        ok: true,
        estanpador
    });
});
exports.getEstanpadores = getEstanpadores;
const nuevoEstanpador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const estanpador = new estanpador_1.Estanpador(req.body);
    yield estanpador.save();
    res.json({
        ok: true,
        estanpador,
    });
});
exports.nuevoEstanpador = nuevoEstanpador;
//# sourceMappingURL=estanpados.js.map