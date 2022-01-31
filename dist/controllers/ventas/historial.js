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
exports.buscarPorLocal = exports.buscarLocales = void 0;
const cliente_1 = require("../../models/ventas/cliente");
const direccion_1 = require("../../models/ventas/direccion");
const orden_1 = require("../../models/ventas/orden");
const usuario_1 = require("../../models/ventas/usuario");
const buscarLocales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locales = yield usuario_1.Usuario.findAll();
    let local = [];
    locales.map(e => {
        if (e.local !== null) {
            local.push(e.local);
        }
    });
    res.json({
        ok: true,
        local
    });
});
exports.buscarLocales = buscarLocales;
const buscarPorLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { local } = req.params;
        const locales = yield usuario_1.Usuario.findAll({ where: { local: local } });
        let ids_local = [];
        locales.map(e => {
            ids_local.push(e.id);
        });
        let id_cliente = [];
        let id_direccion = [];
        let valor = req.query.offset;
        let valorOffset = parseInt(valor);
        const orden = yield orden_1.Orden.findAndCountAll({ where: { id_usuario: ids_local }, order: [['updatedAt', 'DESC']], limit: 10, offset: valorOffset });
        let contador = orden.count;
        orden.rows.map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
            id_cliente.push(e.id_cliente);
            id_direccion.push(e.id_direccion);
        }));
        const cliente = yield cliente_1.Cliente.findAll({ where: { id: id_cliente } });
        const direccion = yield direccion_1.Direccion.findAll({ where: { id: id_direccion } });
        let datos = [];
        for (let i of orden.rows) {
            let newcliente = cliente.find(e => e.id == i.id_cliente);
            let direcciones = direccion.find(h => h.id == i.id_direccion);
            datos = [...datos, { orden: i, cliente: newcliente || "", direccion: direcciones || "" }];
        }
        res.json({
            ok: true,
            contador,
            datos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.buscarPorLocal = buscarPorLocal;
//# sourceMappingURL=historial.js.map