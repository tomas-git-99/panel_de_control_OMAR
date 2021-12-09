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
exports.eliminarTaller = exports.actualizarTaller = exports.crearTaller = void 0;
const talller_1 = require("../../models/produccion/talller");
const crearTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taller = new talller_1.Taller(req.body);
    taller.save();
    res.json({
        ok: true,
        taller
    });
});
exports.crearTaller = crearTaller;
const actualizarTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const taller = yield talller_1.Taller.findByPk(id);
    taller === null || taller === void 0 ? void 0 : taller.update(req.body);
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
//# sourceMappingURL=taller.js.map