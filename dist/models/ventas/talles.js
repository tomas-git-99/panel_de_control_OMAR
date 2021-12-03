"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talle = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Talle extends sequelize_1.Model {
}
exports.Talle = Talle;
Talle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_producto: {
        type: sequelize_1.DataTypes.NUMBER
    },
    talle: {
        type: sequelize_1.DataTypes.NUMBER
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "talles"
});
//# sourceMappingURL=talles.js.map