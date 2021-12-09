import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {
    
    // id:number,
    id_corte: number,
    nombre:string,
    fecha_de_corte: number,
    edad: string,
    rollos: number,
    tela: string,
    total_por_talle: number,
    talles: string,
    total: number,
    peso_promedio: number,
    id_taller: number,
    fecha_de_salida: number,
    fecha_de_entrada: number,
    estado: boolean,

}


export class Produccion_producto extends Model <TodoAtributos>{

    // public id!:number;
    public id_corte!: number;
    public fecha_de_corte!: number;
    public nombre!:string;
    public edad!: string;
    public rollos!: number;
    public tela!: string;
    public total_por_talle!: number;
    public talles!: string;
    public total!: number;
    public peso_promedio!: number;

    public id_taller!: number;
    public fecha_de_salida!: number;
    public fecha_de_entrada!: number;
    public estado!: boolean;


}


Produccion_producto.init(
    {
        // id:{
        //     type:DataTypes.INTEGER,
        //     primaryKey:true,
        //     autoIncrement: true,

        // },
        id_corte:{
            type:DataTypes.NUMBER
        },
        fecha_de_corte: {
            type:DataTypes.NUMBER
        },
        nombre: {
            type:DataTypes.STRING
        },
        edad:{
            type:DataTypes.STRING
        },
        rollos:{
            type:DataTypes.STRING
        },
        tela:{
            type:DataTypes.STRING
        },
        total_por_talle:{
            type:DataTypes.NUMBER
        },
        talles:{
            type:DataTypes.STRING
        },
        total:{
            type:DataTypes.NUMBER
        },
        peso_promedio:{
            type:DataTypes.NUMBER
        },
        id_taller:{
            type:DataTypes.NUMBER
        },
        fecha_de_salida:{
            type:DataTypes.NUMBER
        },
        fecha_de_entrada:{
            type:DataTypes.NUMBER
        },
        estado:{
            type:DataTypes.BOOLEAN
        }
        
    },{
        sequelize: db,
        tableName: "producto_produccion"
    }
)