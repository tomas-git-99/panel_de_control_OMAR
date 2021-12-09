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
exports.obtenerProduccion = exports.actualizarProducto = exports.crearProducto = void 0;
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
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
    yield (producto === null || producto === void 0 ? void 0 : producto.update(req.body));
    res.json({
        ok: true,
        producto
    });
});
exports.actualizarProducto = actualizarProducto;
const obtenerProduccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const produccion = yield productos_produccion_1.Produccion_producto.findAll();
    res.json({
        ok: true,
        produccion
    });
});
exports.obtenerProduccion = obtenerProduccion;
//# sourceMappingURL=producto.js.map