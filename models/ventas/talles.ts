import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    id_producto: number;
    talle: number;
    cantidad:number;
}


export class Talle extends Model <TodoAtributos>{

    public id!:number;

    public id_producto!: number;
    public talle!: number;
    public cantidad!:number;

}


Talle.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },

        id_producto:{
            type:DataTypes.NUMBER
        },
        talle: {
            type:DataTypes.NUMBER
        },
        cantidad:{
            type:DataTypes.NUMBER
        }
        
    },{
        sequelize: db,
        tableName: "talles"
    }
)