"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Carrito extends sequelize_1.Model {
}
exports.Carrito = Carrito;
Carrito.init({
    id_usuario: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_producto: {
        type: sequelize_1.DataTypes.NUMBER
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "carrito"
});
//# sourceMappingURL=carrito.js.map