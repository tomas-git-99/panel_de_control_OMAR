import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Produccion_producto } from "../../models/produccion/productos_produccion";
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


export const buscarSoloPortaller = async (req: Request, res: Response)=> {

    const { id } = req.params;

    let valor:any = req.query.offset;
    let valorOffset = parseInt(valor);

    const produccion_productos = await Produccion_producto.findAndCountAll({ where:{ id_taller: id }, limit:10, offset:valorOffset });

    const taller = await Taller.findAll()

    let contador = produccion_productos.count;
        
    let produccion:any = []

         produccion_productos.rows.map ( (e, i) =>{
             taller.map ( (p,m) => {
                 if(e.id_taller == p.id){
                     produccion = [...produccion, {produccion:e, taller:taller[m]}];
                 }
    
             })
             if(e.id_taller === null){
    
                 produccion = [...produccion, {produccion:e}];
             }
         })

    res.json({
        ok: true, 
        contador,
        produccion
    })
}