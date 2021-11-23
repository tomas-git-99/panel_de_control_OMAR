import {Sequelize} from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();



const db = new Sequelize('chat-destructivo', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});
 


export default db;