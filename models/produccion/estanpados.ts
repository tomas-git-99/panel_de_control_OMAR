import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    id_corte: number;
    id_estanpador: number;
    dibujo: string;
    fecha_de_entrada: number;
    pagado: boolean;
}


export class Estanpados extends Model <TodoAtributos>{

    public id!:number;
    public id_corte!: number;
    public id_estanpador!: number;
    public dibujo!: string;
    public fecha_de_entrada!: number;
    public pagado!: boolean;

}


Estanpados.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        id_corte:{
            type:DataTypes.NUMBER
        },
        id_estanpador:{
            type:DataTypes.NUMBER
        },
        dibujo:{
            type:DataTypes.STRING
        },
        fecha_de_entrada: {
            type:DataTypes.NUMBER
        },
        pagado:{
            type:DataTypes.BOOLEAN
        }
        
    },{
        sequelize: db,
        tableName: "estanpados"
    }
)