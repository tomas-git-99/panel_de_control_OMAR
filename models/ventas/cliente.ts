import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    id:number;
    nombre: string;
    apellido: string;
    dni_cuil: number;
    tel_cel: number;
    email: string;
 
}


export class Cliente extends Model <TodoAtributos>{
    
    public id!:number;
    public nombre!: string;
    public apellido!: string;
    public dni_cuil!: number;
    public tel_cel!: number;
    public email!: string;



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
        email:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "cliente"
    }
)
