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
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    local: {
        type: sequelize_1.DataTypes.STRING
    },
    tela: {
        type: sequelize_1.DataTypes.STRING
    },
    precio: {
        type: sequelize_1.DataTypes.NUMBER
    } /* ,
    talles:{
        type:DataTypes.NUMBER
    },
    talles_unidad:{
        type:DataTypes.NUMBER
    } */
}, {
    sequelize: conectarDB_1.default,
    tableName: "producto"
});
//# sourceMappingURL=producto.js.map