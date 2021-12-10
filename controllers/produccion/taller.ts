import { Request, Response } from "express";
import { Taller } from "../../models/produccion/talller"


export const crearTaller = async (req: Request, res: Response) => {

    const taller = new Taller(req.body);

    await taller.save();

    res.json({
        ok: true,
        taller
    })
    
}


export const actualizarTaller = async (req: Request, res: Response) => {

    const { id } = req.params;
    const taller = await Taller.findByPk(id);

    await taller?.update(req.body);

    res.json({
        ok: true,
        taller
    })
} 


export const eliminarTaller = async (req: Request, res: Response) => {

    const { id } = req.params;

    const taller = await Taller.findByPk(id);

    taller?.destroy();

    res.json({
        ok: true,
        msg:"el taller fue eliminado con exito"
    })
} 

export const obtenerTaller = async (req: Request, res: Response) => {

     const taller = await Taller.findAll();

     res.json({
         ok: true,
         taller
     })
}