import {Sequelize} from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();



/* const db = new Sequelize(process.env.NOMBRE_DB || "", process.env.NOMBRE_USER_DB || "", process.env.PASSWORD_DB || "", {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
}); 
  */


const db = new Sequelize(process.env.DB_NAME_DATABASE || "", process.env.DB_NAME_USER || "", process.env.DB_PASSWORD || "", {
    host: process.env.DB_HOST ,
    port:25060,
    dialect: 'mysql',
    //logging: false,
}); 



////UNICAMENTE PRUEBAS NADA MAS
/*   const db = new Sequelize(process.env.DB_NAME_DATABASE_PRUEBA || "", process.env.DB_NAME_USER_PRUEBA || "", process.env.DB_PASSWORD_PRUEBA || "", {
    host: process.env.DB_HOST_PRUEBA ,
    port:25060,
    dialect: 'mysql',
    //logging: false,
}); 
 */
export default db;
