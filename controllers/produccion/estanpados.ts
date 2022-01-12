import { Request, Response } from "express";
import { Estanpador } from "../../models/produccion/estanpador";
import { Estanpados } from "../../models/produccion/estanpados"
import { Produccion_producto } from "../../models/produccion/productos_produccion";






export const obtenerEstanpados = async (req: Request, res: Response) => {


    const estanpado = await Estanpados.findAll();

    let ids:any = [];
    let ids_estanpador:any = [];


    estanpado.map ( e => {
        ids.push(e.id_corte)
        ids_estanpador.push(e.id_estanpador);

    })

    const producto = await Produccion_producto.findAll({where: {id_corte: ids}});
    const estanpador = await Estanpador.findAll({where: {id: ids_estanpador}});

    let data:any = [];



    for ( let i of estanpado){

        let productoNew = producto.find( e => e.id_corte == i.id_corte);
        let estanpadorNew = estanpador.find( e => e.id == i.id_estanpador);

        data = [...data, { producto:productoNew, estanpado:i, estanpador:estanpadorNew || ""}];

    }
/*     producto.map ( e => {

        estanpado.map( i => {

            if (e.id_corte == i.id_corte){

                data = [...data, { producto:e, estanpado:i}];
            }
        })

    }) */






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


export const obtenerEstanpadorID = async (req: Request, res: Response) => {

try {
    
    const {id} = req.params;


    const estanpados = await Estanpados.findByPk(id);


    const estanpador = await Estanpador.findByPk(estanpados?.id_estanpador);
    const producto = await Produccion_producto.findAll({where:{id_corte:estanpados?.id_corte}});


    res.json({
        ok: true,
        estanpados,
        estanpador:estanpador || "",
        producto:producto[0]
        
    })


} catch (error) {
    
    res.json({ 
        ok: false,
        msg: error
    })
}
}