"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Producto extends sequelize_1.Model {
}
exports.Producto = Producto;
Producto.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    diseño: {
        type: sequelize_1.DataTypes.STRING
    },
    local: {
        type: sequelize_1.DataTypes.STRING
    },
    tela: {
        type: sequelize_1.DataTypes.STRING
    },
    precio: {
        type: sequelize_1.DataTypes.NUMBER
    },
    talles: {
        type: sequelize_1.DataTypes.STRING
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "producto"
});
//# sourceMappingURL=producto.js.map