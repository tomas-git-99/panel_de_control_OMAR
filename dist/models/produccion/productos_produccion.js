"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produccion_producto = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../../DB/conectarDB"));
class Produccion_producto extends sequelize_1.Model {
}
exports.Produccion_producto = Produccion_producto;
Produccion_producto.init({
    // id:{
    //     type:DataTypes.INTEGER,
    //     primaryKey:true,
    //     autoIncrement: true,
    // },
    id_corte: {
        type: sequelize_1.DataTypes.NUMBER
    },
    fecha_de_corte: {
        type: sequelize_1.DataTypes.NUMBER
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    edad: {
        type: sequelize_1.DataTypes.STRING
    },
    rollos: {
        type: sequelize_1.DataTypes.STRING
    },
    tela: {
        type: sequelize_1.DataTypes.STRING
    },
    total_por_talle: {
        type: sequelize_1.DataTypes.NUMBER
    },
    talles: {
        type: sequelize_1.DataTypes.NUMBER
    },
    total: {
        type: sequelize_1.DataTypes.NUMBER
    },
    peso_promedio: {
        type: sequelize_1.DataTypes.NUMBER
    },
    id_taller: {
        type: sequelize_1.DataTypes.NUMBER
    },
    fecha_de_salida: {
        type: sequelize_1.DataTypes.NUMBER
    },
    fecha_de_entrada: {
        type: sequelize_1.DataTypes.NUMBER
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "producto_produccion"
});
//# sourceMappingURL=productos_produccion.js.map