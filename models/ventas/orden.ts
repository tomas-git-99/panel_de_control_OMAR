import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id_cliente: number;
    id_usuario: number;
    total:number;
    url_pdf_cliente:string;
    url_pdf_venta:string;
}


export class Orden extends Model <TodoAtributos>{

    public id_cliente!: number;
    public id_usuario!: number;
    public total!:number;
    public url_pdf_cliente!:string;
    public url_pdf_venta!:string;

}


Orden.init(
    {

        id_cliente:{
            type:DataTypes.NUMBER
        },
        id_usuario: {
            type:DataTypes.NUMBER
        },
        total:{
            type:DataTypes.NUMBER
        },
        url_pdf_cliente:{
            type:DataTypes.STRING
        },
        url_pdf_venta:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "orden"
    }
)