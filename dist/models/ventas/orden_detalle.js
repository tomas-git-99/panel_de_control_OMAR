"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenDetalle = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class OrdenDetalle extends sequelize_1.Model {
}
exports.OrdenDetalle = OrdenDetalle;
OrdenDetalle.init({
    id_orden: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_producto: {
        type: sequelize_1.DataTypes.NUMBER
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER
    },
    talle: {
        type: sequelize_1.DataTypes.STRING
    },
    precio: {
        type: sequelize_1.DataTypes.NUMBER
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "orden_detalle"
});
//# sourceMappingURL=orden_detalle.js.map