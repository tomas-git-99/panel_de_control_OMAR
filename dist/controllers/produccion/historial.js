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
exports.pagarAtalleres = exports.buscarProductosFecha = exports.historialTaller = void 0;
const dist_1 = require("sequelize/dist");
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
const buscarProductosFecha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fecha_de_entrada } = req.body;
    const productos = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_taller: id, fecha_de_entrada: { [dist_1.Op.between]: [fecha_de_entrada[0], fecha_de_entrada[1]] }, estado: false } });
    /*
        let data:any = [];
    
        productos.filter( (e:any) => {
    
            if(e.id_taller == id){
                data.push(e)
            }
        })
     */
    res.json({
        productos
    });
});
exports.buscarProductosFecha = buscarProductosFecha;
const pagarAtalleres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fecha_de_entrada } = req.body;
        const productos = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_taller: id, fecha_de_entrada: { [dist_1.Op.between]: [fecha_de_entrada[0], fecha_de_entrada[1]] }, estado: false } });
        productos.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            yield e.update({ estado: true, fecha_de_pago: req.body.fecha_de_pago });
        }));
        res.json({
            ok: true,
            msg: "Se pago todo correctamente"
        });
    }
    catch (error) {
        res.json({ ok: false, msg: error });
    }
});
exports.pagarAtalleres = pagarAtalleres;
//# sourceMappingURL=historial.js.map