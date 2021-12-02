import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    
    id: number;
    nombre: string;
    cantidad: number;
    local:string;
    tela:string;
    precio:number;
/*     talles: number;
    talles_unidad: number; */
}


export class Producto extends Model <TodoAtributos>{

    public id!: number;
    public nombre!: string;
    public cantidad!: number;
    public local!:string;
    public tela!:string;
    public precio!:number;
/*     public talles!: number;
    public talles_unidad!: number; */

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
        local:{
            type:DataTypes.STRING
        },
        tela:{
            type:DataTypes.STRING

        },
        precio:{
            type:DataTypes.NUMBER
        }/* ,
        talles:{
            type:DataTypes.NUMBER
        },
        talles_unidad:{
            type:DataTypes.NUMBER
        } */
        
    },{
        sequelize: db,
        tableName: "producto"
    }
)