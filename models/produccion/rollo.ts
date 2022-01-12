import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    nombre:string; 

}


export class Rollo extends Model <TodoAtributos>{

    public id!:number;
    public nombre!: string;


}


Rollo.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },

        nombre:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "rollo"
    }
)