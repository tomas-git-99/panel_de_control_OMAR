"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../DB/conectarDB"));
class Usuario extends sequelize_1.Model {
}
exports.Usuario = Usuario;
Usuario.init({
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    dni: {
        type: sequelize_1.DataTypes.NUMBER
    },
    rol: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "usuarios"
});
//# sourceMappingURL=usuario.js.map