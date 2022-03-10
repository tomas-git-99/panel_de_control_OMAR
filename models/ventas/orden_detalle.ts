import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

 
    id_orden: number;
    id_producto: number;
    nombre_producto:string;
    cantidad:number;
    talle:string;
    precio:number;
    nota:string;

}


export class OrdenDetalle extends Model <TodoAtributos>{

    public id_orden!: number;
    public id_producto!: number;
    public nombre_producto!: string;
    public cantidad!:number;
    public talle!:string;
    public precio!:number;
    public nota!:string;

}


OrdenDetalle.init(
    {
   
        id_orden:{
            type:DataTypes.NUMBER
        },
        id_producto: {
            type:DataTypes.NUMBER
        },
        nombre_producto: {
            type:DataTypes.STRING
        },
        cantidad:{
            type:DataTypes.NUMBER
        },
        talle:{
             type:DataTypes.NUMBER
        },
        precio:{
            type:DataTypes.NUMBER
        },
        nota:{
            type:DataTypes.STRING
        }
        
        
    },{
        sequelize: db,
        tableName: "orden_detalle"
    }
)