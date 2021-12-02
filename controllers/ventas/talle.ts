import { Request, Response } from "express";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";




export const agregarTalle = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
    
        const { cantidad, talle} = req.body;
    
    
    
        const producto = await Producto.findByPk(id);
    
        if(!producto){
            return res.status(505).json({
                ok: false,
                msg:"ese producto no existe"
            })
        }
    
        const dato:any = {
            id_producto: id,
            cantidad,
            talle
        }
    
        console.log(dato)
        const talles = new Talle(dato);
    
        await talles.save();

    
        res.json({
            ok: true,
            talles
        });
    } catch (error) {
        return res.status(505).json({ok: false, msg: error})
    }

}