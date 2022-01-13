import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    id:number;

    nombre: string;
    venta: string;
    password: string;
    dni_cuil: number;
    rol: string;
    estado: boolean;
}


export class Usuario extends Model <TodoAtributos>{

    public id!:number;

    public nombre!: string;
    public venta!: string;
    public password!: string;
    public dni_cuil!: number;
    public rol!: string;
    public estado!: boolean;

}


Usuario.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        nombre:{
            type:DataTypes.STRING
        },
        venta:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING
        },
        dni_cuil:{
            type:DataTypes.NUMBER

        },
        rol:{
            type:DataTypes.STRING
        },
        estado:{
            type:DataTypes.BOOLEAN
        }
        
    },{
        sequelize: db,
        tableName: "usuario"
    }
)
