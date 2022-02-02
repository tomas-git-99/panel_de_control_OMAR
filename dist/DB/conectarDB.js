"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* const db = new Sequelize(process.env.NOMBRE_DB || "", process.env.NOMBRE_USER_DB || "", process.env.PASSWORD_DB || "", {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});  */
const db = new sequelize_1.Sequelize(process.env.DB_NAME_DATABASE || "", process.env.DB_NAME_USER || "", process.env.DB_PASSWORD || "", {
    host: process.env.DB_HOST,
    port: 25060,
    dialect: 'mysql',
});
////UNICAMENTE PRUEBAS NADA MAS
/*   const db = new Sequelize(process.env.DB_NAME_DATABASE_PRUEBA || "", process.env.DB_NAME_USER_PRUEBA || "", process.env.DB_PASSWORD_PRUEBA || "", {
    host: process.env.DB_HOST_PRUEBA ,
    port:25060,
    dialect: 'mysql',
    //logging: false,
});
 */
exports.default = db;
//# sourceMappingURL=conectarDB.js.map