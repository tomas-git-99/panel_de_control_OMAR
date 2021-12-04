import { NextFunction, Request, response, Response } from "express";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";




export const agregarTalle = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        
    
        const { cantidad, talle} = req.body;
    
    
        const talles_unidad = await Talle.findAll({where:{id_producto:id}});

        await talles_unidad.map((t) => {
            if (t.talle == talle){
            return res.status(505).json({
                ok: false,
                error: 2,
                msg:"El talle que intento agregar, ya esta registrado con este producto "
            })

        }
        })
        
        
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
        

        
        const talles = new Talle(dato);
        
        await talles.save();

    
        return res.json({
            ok: true,
            talles
        });

        
    } catch (error) {
        return res.status(505).json({ok: false, msg: error})
    }

}

export const sumarTalle = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { cantidad } = req.body;

    const talle = await Talle.findByPk(id);

    if(talle!.cantidad < cantidad){
        return res.json({ 
            ok: false, 
            msg:"La cantidad puesa no se puede restar porque es mayor a stock actual"
        })
    }

    let nuevaCantida = talle?.cantidad + cantidad;

    await talle?.update({cantidad:nuevaCantida});


    res.json({
        ok: true,
        talle
    })


}

export const restarTalle = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { cantidad } = req.body;

    const talle = await Talle.findByPk(id);

    if(talle!.cantidad < cantidad){
        return res.json({ 
            ok: false, 
            msg:"La cantidad insertada no se puede restar porque es mayor a stock actual"
        })
    }

    let nuevaCantida = talle!.cantidad - cantidad;


    await talle?.update({cantidad:nuevaCantida});

    res.json({
        ok: true,
        talle
    })


}

export const eliminarTalle = async (req: Request, res: Response)  => {

    const { id } = req.params;

    const talle = await Talle.findByPk(id);

    talle?.destroy();


    res.json({ 
        ok: true,
        msg: 'Talle fue eliminado con exito'
    });

}