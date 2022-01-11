"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orden_publico = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Orden_publico extends sequelize_1.Model {
}
exports.Orden_publico = Orden_publico;
Orden_publico.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_cliente: {
        type: sequelize_1.DataTypes.NUMBER
    },
    total: {
        type: sequelize_1.DataTypes.NUMBER,
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "orden_publico"
});
//# sourceMappingURL=orden_publico.js.map