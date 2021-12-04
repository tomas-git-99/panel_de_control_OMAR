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
exports.eliminarTalle = exports.restarTalle = exports.sumarTalle = exports.agregarTalle = void 0;
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const agregarTalle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        /*         ok: false,
                error: 2,
                msg:"El talle que intento agregar, ya esta registrado con este producto "
             */
        const { cantidad, talle } = req.body;
        const talles_unidad = yield talles_1.Talle.findAll({ where: { id_producto: id } });
        let talle_repetido = talles_unidad.find(e => e.talle == talle ? true : false);
        if ((talle_repetido === null || talle_repetido === void 0 ? void 0 : talle_repetido.talle) == talle) {
            return res
                .json({
                ok: false,
                error: 2,
                msg: "El talle que intento agregar, ya esta registrado con este producto "
            });
        }
        const producto = yield producto_1.Producto.findByPk(id);
        if (!producto) {
            res.status(505).json({
                ok: false,
                msg: "ese producto no existe"
            });
        }
        const dato = {
            id_producto: id,
            cantidad,
            talle
        };
        const talles = new talles_1.Talle(dato);
        yield talles.save();
        res.json({
            ok: true,
            talles
        });
    }
    catch (error) {
        res.status(505).json({ ok: false, msg: error });
    }
});
exports.agregarTalle = agregarTalle;
const sumarTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { cantidad } = req.body;
    const talle = yield talles_1.Talle.findByPk(id);
    if (talle.cantidad < cantidad) {
        return res.json({
            ok: false,
            msg: "La cantidad puesa no se puede restar porque es mayor a stock actual"
        });
    }
    let nuevaCantida = (talle === null || talle === void 0 ? void 0 : talle.cantidad) + cantidad;
    yield (talle === null || talle === void 0 ? void 0 : talle.update({ cantidad: nuevaCantida }));
    res.json({
        ok: true,
        talle
    });
});
exports.sumarTalle = sumarTalle;
const restarTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { cantidad } = req.body;
    const talle = yield talles_1.Talle.findByPk(id);
    if (talle.cantidad < cantidad) {
        return res.json({
            ok: false,
            msg: "La cantidad insertada no se puede restar porque es mayor a stock actual"
        });
    }
    let nuevaCantida = talle.cantidad - cantidad;
    yield (talle === null || talle === void 0 ? void 0 : talle.update({ cantidad: nuevaCantida }));
    res.json({
        ok: true,
        talle
    });
});
exports.restarTalle = restarTalle;
const eliminarTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const talle = yield talles_1.Talle.findByPk(id);
    talle === null || talle === void 0 ? void 0 : talle.destroy();
    res.json({
        ok: true,
        msg: 'Talle fue eliminado con exito'
    });
});
exports.eliminarTalle = eliminarTalle;
//# sourceMappingURL=talle.js.map