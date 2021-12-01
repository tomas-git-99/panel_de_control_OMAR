"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direccion = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Direccion extends sequelize_1.Model {
}
exports.Direccion = Direccion;
Direccion.init({
    id_cliente: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING
    },
    cp: {
        type: sequelize_1.DataTypes.NUMBER
    },
    provincia: {
        type: sequelize_1.DataTypes.STRING
    },
    localidad: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "direccion"
});
//# sourceMappingURL=direccion.js.map