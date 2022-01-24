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
exports.obtenerDireccion = exports.agregarDirecciones = void 0;
const direccion_1 = require("../../models/ventas/direccion");
const agregarDirecciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { direccion, cp, provincia, localidad } = req.body;
    const data = {
        id_cliente: id,
        direccion,
        cp,
        provincia,
        localidad
    };
    const direcciones = new direccion_1.Direccion(data);
    yield direcciones.save();
    res.json({
        ok: true,
        direcciones
    });
});
exports.agregarDirecciones = agregarDirecciones;
const obtenerDireccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const direccion_ = yield direccion_1.Direccion.findAll({ where: { id_cliente: id } });
        let direccion = [];
        direccion_.map(e => {
            if (e.direccion.length > 0) {
                direccion.push(e);
            }
        });
        res.json({
            ok: true,
            direccion
        });
    }
    catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerDireccion = obtenerDireccion;
//# sourceMappingURL=direccion.js.map