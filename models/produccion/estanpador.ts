import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    nombre: string;
    telefono: number;
    direccion: string;
}


export class Estanpador extends Model <TodoAtributos>{

    public id!:number;

    public nombre!: string;
    public telefono!: number;
    public direccion!:string;

}


Estanpador.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },

        nombre:{
            type:DataTypes.STRING
        },
        telefono: {
            type:DataTypes.NUMBER
        },
        direccion:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "estanpador"
    }
)