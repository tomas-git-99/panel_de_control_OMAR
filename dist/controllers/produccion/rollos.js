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
exports.eliminarUnRollo = exports.eliminarRolloTodos = exports.cambiarDatosDeRollos = exports.agregarRollosID = exports.obtenerRollosID = exports.obtenerTodoRollo = exports.crearNuevoRollo = void 0;
const rollo_1 = require("../../models/produccion/rollo");
const rollos_1 = require("../../models/produccion/rollos");
const crearNuevoRollo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rollo = new rollo_1.Rollo(req.body);
        yield rollo.save();
        res.json({
            ok: true,
            rollo
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.crearNuevoRollo = crearNuevoRollo;
const obtenerTodoRollo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rollo = yield rollo_1.Rollo.findAll();
        let ids = [];
        rollo.map(e => {
            ids.push(e.id);
        });
        const rollos = yield rollos_1.Rollos.findAll({ where: { id_rollo: ids } });
        let data = [];
        for (let i of rollo) {
            let rollosNew = rollos.filter(e => {
                let contador = 0;
                if (e.id_rollo == i.id) {
                    contador += e.cantidad;
                    return contador;
                }
            });
            data = [...data, { rollos: rollosNew, rollo: i }];
        }
        res.json({
            ok: true,
            data
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerTodoRollo = obtenerTodoRollo;
const obtenerRollosID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rollos = yield rollos_1.Rollos.findAll({ where: { id_rollo: id } });
        res.json({
            ok: true,
            rollos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerRollosID = obtenerRollosID;
const agregarRollosID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rollos = new rollos_1.Rollos(req.body);
        yield rollos.save();
        res.json({
            ok: true,
            rollos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.agregarRollosID = agregarRollosID;
const cambiarDatosDeRollos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rollos = yield rollos_1.Rollos.findByPk(id);
        yield (rollos === null || rollos === void 0 ? void 0 : rollos.update(req.body));
        res.json({
            ok: true,
            rollos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.cambiarDatosDeRollos = cambiarDatosDeRollos;
const eliminarRolloTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rollos = yield rollo_1.Rollo.findByPk(id);
        yield rollos_1.Rollos.destroy({ where: { id_rollo: id } });
        yield (rollos === null || rollos === void 0 ? void 0 : rollos.destroy());
        res.json({
            ok: true,
            msg: "Se elimino"
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.eliminarRolloTodos = eliminarRolloTodos;
const eliminarUnRollo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rollo = yield rollos_1.Rollos.findByPk(id);
        yield (rollo === null || rollo === void 0 ? void 0 : rollo.destroy());
        res.json({
            ok: true,
            msg: "Se elimino"
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.eliminarUnRollo = eliminarUnRollo;
//# sourceMappingURL=rollos.js.map