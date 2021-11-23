import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {
    nombre: string;
    cantidad: number;
    local:string;
    tela:string;
    precio:number;
    talles: number; // que talles ahi

    talles_unidad: number;
}


export class Producto extends Model <TodoAtributos>{

    public nombre!: string;
    public cantidad!: number;
    public local!:string;
    public tela!:string;
    public precio!:number;
    public talles!: number; // que talles ahi 
    public talles_unidad!: number;

}


Producto.init(
    {
        nombre:{
            type:DataTypes.STRING
        },
        cantidad:{
            type:DataTypes.NUMBER,
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
            type:DataTypes.NUMBER
        },
        talles_unidad:{
            type:DataTypes.NUMBER
        }
        
    },{
        sequelize: db,
        tableName: "producto"
    }
)