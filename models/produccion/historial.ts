import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    id_producto: number;
    id_taller: number;
}


export class Historial extends Model <TodoAtributos>{

    public id!:number;

    public id_producto!: number;
    public id_taller!: number;

}


Historial.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },

        id_producto:{
            type:DataTypes.NUMBER
        },
        id_taller: {
            type:DataTypes.NUMBER
        }
        
    },{
        sequelize: db,
        tableName: "historial_taller"
    }
)