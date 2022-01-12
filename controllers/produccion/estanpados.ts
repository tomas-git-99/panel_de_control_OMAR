import { Request, Response } from "express";
import { Estanpador } from "../../models/produccion/estanpador";
import { Estanpados } from "../../models/produccion/estanpados"
import { Produccion_producto } from "../../models/produccion/productos_produccion";






export const obtenerEstanpados = async (req: Request, res: Response) => {


    const estanpado = await Estanpados.findAll();

    let ids:any = [];


    estanpado.map ( e => {
        ids.push(e.id_corte)
    })

    const producto = await Produccion_producto.findAll({where: {id_corte: ids}});

    let data:any = [];

    producto.map ( e => {

        estanpado.map( i => {

            if (e.id_corte == i.id_corte){

                data = [...data, { producto:e, estanpado:i}];
            }
        })

    })






    res.json({
        ok: true,
        data
    });

}



export const cambiarEstanpado = async (req: Request, res: Response) => {


    const { id } = req.params;

    const producto = await Estanpados.findByPk(id);


    await producto?.update(req.body);


    res.json({
        ok: true
    })
}


export const getEstanpadores = async (req: Request, res: Response) =>{

    const estanpador = await Estanpador.findAll()


    res.json({
        ok: true,
        estanpador
    })
}



export const nuevoEstanpador = async (req: Request, res: Response) => {

    const estanpador = new Estanpador(req.body);

    await estanpador.save();
    res.json({
        ok: true,
        estanpador,
    })
}