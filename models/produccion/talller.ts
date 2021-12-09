import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    nombre_completo: string;
    telefono: number;
    direccion: string;
}


export class Taller extends Model <TodoAtributos>{

    public id!:number;

    public nombre_completo!: string;
    public telefono!: number;
    public direccion!:string;

}


Taller.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },

        nombre_completo:{
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
        tableName: "taller"
    }
)