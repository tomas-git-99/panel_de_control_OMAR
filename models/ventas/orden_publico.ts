import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    id:number;
    id_cliente: number;
    id_usuario: number;
    total: number;

 
}


export class Orden_publico extends Model <TodoAtributos>{
    
    public id!:number;
    public id_cliente!: number;
    public id_usuario!: number;
    public total!: number;


}


Orden_publico.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        id_usuario:{
            type:DataTypes.NUMBER
        },
        id_cliente:{
            type:DataTypes.NUMBER
        },
        total:{
            type:DataTypes.NUMBER,
        }
        
    },{
        sequelize: db,
        tableName: "orden_publico"
    }
)
