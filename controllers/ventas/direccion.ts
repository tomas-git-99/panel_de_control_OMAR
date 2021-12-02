import { Request, Response } from "express";
import { Direccion } from "../../models/ventas/direccion";




export const agregarDirecciones = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { direccion, cp, provincia, localidad} = req.body;

    const data:any = {
        id_cliente: id,
        direccion,
        cp,
        provincia,
        localidad
    }

    const newDireccion = new Direccion(data);

    await newDireccion.save();

    res.json({
        ok: true,
        newDireccion
    })
}


export const obtenerDireccion = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;

        const direccion = await Direccion.findAll({where: { id_cliente:id}});
    
    
        res.json({
            ok: true,
            direccion
        })
    } catch (error) {
        res.status(505).json({ 
            ok: false,
            msg:error
        })
    }

}