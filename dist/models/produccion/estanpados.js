"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estanpados = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Estanpados extends sequelize_1.Model {
}
exports.Estanpados = Estanpados;
Estanpados.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_corte: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_estanpador: {
        type: sequelize_1.DataTypes.NUMBER
    },
    dibujo: {
        type: sequelize_1.DataTypes.STRING
    },
    fecha_de_entrada: {
        type: sequelize_1.DataTypes.NUMBER
    },
    pagado: {
        type: sequelize_1.DataTypes.BOOLEAN
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "estanpados"
});
//# sourceMappingURL=estanpados.js.map