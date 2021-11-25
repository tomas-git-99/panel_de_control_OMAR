"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orden = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Orden extends sequelize_1.Model {
}
exports.Orden = Orden;
Orden.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_cliente: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_usuario: {
        type: sequelize_1.DataTypes.NUMBER
    },
    total: {
        type: sequelize_1.DataTypes.NUMBER
    },
    url_pdf_cliente: {
        type: sequelize_1.DataTypes.STRING
    },
    url_pdf_venta: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "orden"
});
//# sourceMappingURL=orden.js.map