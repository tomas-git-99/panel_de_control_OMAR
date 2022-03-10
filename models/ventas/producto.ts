import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    
    id: number;
    nombre: string;
    cantidad: number;
    diseño: string;
    local:string;
    tela:string;
    precio:number;
    talles: string;
    estado: boolean;
    color: string;
    // talles_unidad: number;
}


export class Producto extends Model <TodoAtributos>{

    public id!: number;
    public nombre!: string;
    public cantidad!: number;
    public diseño!: string;
    public local!:string;
    public tela!:string;
    public precio!:number;
    public talles!: string;
    public estado!: boolean;
    public color!: string;

    // public talles_unidad!: number; 

}


Producto.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        nombre:{
            type:DataTypes.STRING
        },
        cantidad:{
            type:DataTypes.NUMBER,
        },
        diseño:{
            type:DataTypes.STRING
        },
        local:{
            type:DataTypes.STRING
        },
        tela:{
            type:DataTypes.STRING

        },
        precio:{
            type:DataTypes.NUMBER
        },
        talles:{
            type:DataTypes.STRING
        },
        estado:{
            type:DataTypes.BOOLEAN
        },
        color:{
            type:DataTypes.STRING
        },
        
    },{
        sequelize: db,
        tableName: "producto"
    }
)