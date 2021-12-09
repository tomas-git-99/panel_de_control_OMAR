"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Historial = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Historial extends sequelize_1.Model {
}
exports.Historial = Historial;
Historial.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_producto: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_taller: {
        type: sequelize_1.DataTypes.NUMBER
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "historial_taller"
});
//# sourceMappingURL=historial.js.map