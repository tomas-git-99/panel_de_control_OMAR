import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    id:number;
    nombre: string;
    apellido: string;
    dni_cuil: number;
    tel_cel: number;
    direccion: string;
    cp: number;
    provincia: string;
    localidad: string;
}


export class Cliente extends Model <TodoAtributos>{
    
    public id!:number;
    public nombre!: string;
    public apellido!: string;
    public dni_cuil!: number;
    public tel_cel!: number;
    public direccion!: string;
    public cp!: number;
    public provincia!: string;
    public localidad!: string;

}


Cliente.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        nombre:{
            type:DataTypes.STRING
        },
        apellido:{
            type:DataTypes.STRING,
        },
        dni_cuil:{
            type:DataTypes.NUMBER
        },
        tel_cel:{
            type:DataTypes.NUMBER

        },
        direccion:{
            type:DataTypes.STRING
        },
        cp:{
            type:DataTypes.NUMBER
        },
        provincia:{
            type:DataTypes.STRING
        },
        localidad:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "cliente"
    }
)
