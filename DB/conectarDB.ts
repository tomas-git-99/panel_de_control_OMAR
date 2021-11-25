import {Sequelize} from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();



const db = new Sequelize(process.env.NOMBRE_DB || "", process.env.NOMBRE_USER_DB || "", process.env.PASSWORD_DB || "", {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});
 


export default db;