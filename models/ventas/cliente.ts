import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {
    nombre: string;
    apellido: string;
    dni_cuil: number;
    tel_cel: number;
    direccion: string;
    codigo_postal: number;
    provincia: string;
    localidad: string;
}


export class Cliente extends Model <TodoAtributos>{

    public nombre!: string;
    public apellido!: string;
    public dni_cuil!: number;
    public tel_cel!: number;
    public direccion!: string;
    public codigo_postal!: number;
    public provincia!: string;
    public localidad!: string;

}


Cliente.init(
    {
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
        codigo_postal:{
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
