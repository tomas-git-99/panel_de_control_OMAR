import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';


export interface TodoAtributos {

    id_cliente:number;
    direccion: string;
    cp: number;
    provincia: string;
    localidad: string;
}


export class Direccion extends Model <TodoAtributos>{
    
    public id_cliente!:number;
    public direccion!: string;
    public cp!: number;
    public provincia!: string;
    public localidad!: string;

}


Direccion.init(
    {
        id_cliente:{
            type:DataTypes.NUMBER,

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
        tableName: "direccion"
    }
)
