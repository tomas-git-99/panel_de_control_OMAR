"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estanpador = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Estanpador extends sequelize_1.Model {
}
exports.Estanpador = Estanpador;
Estanpador.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    telefono: {
        type: sequelize_1.DataTypes.NUMBER
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "estanpador"
});
//# sourceMappingURL=estanpador.js.map