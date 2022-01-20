import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Historial } from "../../models/produccion/historial";
import { Produccion_producto } from "../../models/produccion/productos_produccion";




export const historialTaller = async (req: Request, res: Response) => {
    const { id_taller } = req.params;

    const productos = await Produccion_producto.findAll({where: {id_taller:id_taller}});


    res.json({
        ok: true,
        productos
    });



}



export const buscarProductosFecha = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { fecha_de_entrada } = req.body;
    const productos = await Produccion_producto.findAll({where: {id_taller:id, fecha_de_entrada:{[Op.between]:[fecha_de_entrada[0], fecha_de_entrada[1]]}, estado:false}});

/* 
    let data:any = [];

    productos.filter( (e:any) => {

        if(e.id_taller == id){
            data.push(e)
        }
    })
 */


    res.json({
        productos
    })
}



export const pagarAtalleres = async (req: Request, res: Response) => {


    try {
        
        const { id } = req.params;
    
        const { fecha_de_entrada } = req.body;
    
        const productos = await Produccion_producto.findAll({where: {id_taller:id, fecha_de_entrada:{[Op.between]:[fecha_de_entrada[0], fecha_de_entrada[1]]}, estado:false}}); 
    
    
    
        productos.map( async(e) => {
            await e.update({estado:true, fecha_de_pago:req.body.fecha_de_pago})
        })
    
        res.json({
            ok: true,
            msg:"Se pago todo correctamente"
        })
        
    } catch (error) {
        res.json({ok:false, msg:error})
    }
}


