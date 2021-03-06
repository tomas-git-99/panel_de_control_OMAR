import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {
    
    id: number;
    id_usuario: number;
    id_producto: number;
    talle: number;
    cantidad:number;
    precio_nuevo:number;
    nota:string;
}


export class Carrito extends Model <TodoAtributos>{
    
    public id!: number;
    public id_usuario!: number;
    public id_producto!: number;
    public talle!: number;

    public cantidad!:number;
    public precio_nuevo!:number;
    public nota!:string;


}


Carrito.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        id_usuario:{
            type:DataTypes.NUMBER
        },
        id_producto: {
            type:DataTypes.NUMBER
        },
        talle: {
            type:DataTypes.NUMBER
        },
        cantidad:{
            type:DataTypes.NUMBER
        },
        precio_nuevo:{
            type:DataTypes.NUMBER
        },
        nota:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "carrito"
    }
)