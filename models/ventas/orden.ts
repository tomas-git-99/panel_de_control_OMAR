import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    id_cliente: number;
    id_usuario: number;
    id_direccion: number;
    fecha: number;
    transporte: string;
    total:number;

}


export class Orden extends Model <TodoAtributos>{
    public id!:number;
    public id_cliente!: number;
    public id_usuario!: number;
    public id_direccion!: number;
    public fecha!: number;
    public transporte!: string;
    public total!:number;
}


Orden.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        id_cliente:{
            type:DataTypes.NUMBER
        },
        id_usuario: {
            type:DataTypes.NUMBER
        },
        id_direccion:{
            type:DataTypes.NUMBER
        },
        fecha:{
            type:DataTypes.NUMBER
        },
        transporte:{
            type:DataTypes.STRING
        },
        total:{
            type:DataTypes.NUMBER
        }

        
    },{
        sequelize: db,
        tableName: "orden"
    }
)