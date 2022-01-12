"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rollos = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Rollos extends sequelize_1.Model {
}
exports.Rollos = Rollos;
Rollos.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_rollo: {
        type: sequelize_1.DataTypes.NUMBER
    },
    cantidad: {
        type: sequelize_1.DataTypes.NUMBER
    },
    estanpado: {
        type: sequelize_1.DataTypes.STRING
    },
    color: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "rollos"
});
//# sourceMappingURL=rollos.js.map