import { Request, Response } from "express";
import { Op } from "sequelize/dist";
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


export const buscarUnicTaller = async (req: Request, res: Response) => {

    try {

        const taller = await Taller.findAll({where: {nombre_completo:{ [Op.like]: '%'+ req.query.nombre +'%'}}});
        res.json({ok: true, taller})
        
    } catch (error) {
        res.json({ok: false, msg:error})
    }


}