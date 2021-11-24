import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    nombre: string;
    correo: string;
    password: string;
    dni: number;
    rol: string;
    
}


export class Usuario extends Model <TodoAtributos>{

    public nombre!: string;
    public correo!: string;
    public password!: string;
    public dni!: number;
    public rol!: string;

}


Usuario.init(
    {
        nombre:{
            type:DataTypes.STRING
        },
        correo:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING
        },
        dni:{
            type:DataTypes.NUMBER

        },
        rol:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "usuarios"
    }
)
