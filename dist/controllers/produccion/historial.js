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
exports.historialTaller = void 0;
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const historialTaller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_taller } = req.params;
    const productos = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_taller: id_taller } });
    res.json({
        ok: true,
        productos
    });
});
exports.historialTaller = historialTaller;
//# sourceMappingURL=historial.js.map