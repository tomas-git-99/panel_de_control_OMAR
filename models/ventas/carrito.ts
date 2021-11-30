import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id_usuario: number;
    id_producto: number;
    cantidad:number;

}


export class Carrito extends Model <TodoAtributos>{

    public id_usuario!: number;
    public id_producto!: number;
    public cantidad!:number;


}


Carrito.init(
    {

        id_usuario:{
            type:DataTypes.NUMBER
        },
        id_producto: {
            type:DataTypes.NUMBER
        },
        cantidad:{
            type:DataTypes.NUMBER
        }
        
    },{
        sequelize: db,
        tableName: "carrito"
    }
)