import {DataTypes, Model} from 'sequelize';
import db from '../../DB/conectarDB';

export interface TodoAtributos {

    id:number;
    id_rollo:number; 
    cantidad:number; 
    estanpado:string;
    color:string; 

}


export class Rollos extends Model <TodoAtributos>{

    public id!:number;
    public id_rollo!:string; 
    public cantidad!:number; 
    public estanpado!:string;
    public color!:string; 


}


Rollos.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        id_rollo:{
            type:DataTypes.NUMBER
        },
        cantidad:{
            type:DataTypes.NUMBER
        },
        estanpado:{
            type:DataTypes.STRING
        },
        color:{
            type:DataTypes.STRING
        }
        
    },{
        sequelize: db,
        tableName: "rollos"
    }
)