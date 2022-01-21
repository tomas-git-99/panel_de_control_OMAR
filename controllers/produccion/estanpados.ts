import { Request, Response } from "express";
import fecha from "fecha";
import { Op, where } from "sequelize/dist";
import { Estanpador } from "../../models/produccion/estanpador";
import { Estanpados } from "../../models/produccion/estanpados"
import { Produccion_producto } from "../../models/produccion/productos_produccion";






export const obtenerEstanpados = async (req: Request, res: Response) => {




    try {
        
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

        data = [...data, { producto:productoNew || "", estanpado:i, estanpador:estanpadorNew || ""}];

    }



    res.json({
        ok: true,
        data
    });
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }

}



export const cambiarEstanpado = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;

        const producto = await Estanpados.findByPk(id);
    
    
        await producto?.update(req.body);
    
    
        res.json({
            ok: true
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }



}


export const getEstanpadores = async (req: Request, res: Response) =>{

    const estanpador = await Estanpador.findAll()


    res.json({
        ok: true,
        estanpador
    })
}



export const nuevoEstanpador = async (req: Request, res: Response) => {

    try {
        const estanpador = new Estanpador(req.body);

        await estanpador.save();
        res.json({
            ok: true,
            estanpador,
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }


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


export const buscarEstapados = async (req: Request, res: Response) => {


    const { valor } = req.body;
    const { query } = req.params; 


            searchFunc(query, valor)
                .then( data => {
                    res.json({
                        ok: true,
                        data
                    })
                })
                .catch (error => {
                    res.json({
                        ok: false,
                        msg: error
                    })
                })

 
}



const searchFunc = async(palabra:any, valor: false | null | number) =>{

    let buscar:any = {
        where: {

        },order: [['updatedAt', 'DESC']]
    }

    buscar.where[`${palabra}`] = valor;

/*     const produccion_productos = await Estanpados.findAll(buscar);
    
    const taller = await Estanpador.findAll() */
    const estanpado = await Estanpados.findAll(buscar);

    const estanpador = await Estanpador.findAll()

    const producto = await Produccion_producto.findAll()

    let data:any = []

    for (let i of estanpado){
        let productoNew = producto.find( h => h.id_corte == i.id_corte);
        let estanpadorNew = estanpador.find( e => e.id == i.id_estanpador);

        data = [...data, {estanpado:i, estanpador:estanpadorNew || "", producto:productoNew}];

    }
/* 
         estanpado.map ( (e, i) =>{
            estanpador.map ( (p,m) => {
                 if(e.id_estanpador == p.id){

                    let productoNew = producto.find( h => h.id_corte == e.id_corte);

                    data = [...data, {estanpado:e, estanpador:p, producto:productoNew}];
                 }
    
             })
   
         }) */

 

    return data;

}




export const buscarEstampados = async (req: Request, res: Response) => {

    try {
        const dato = req.query;

        const produccion_productos = await Produccion_producto.findAll({ where:{ 
            nombre:{ [Op.like]: '%'+ dato.nombre +'%'},
            // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
        }});
    
    
    
    
        let ids:any = []
    
        produccion_productos.map ( e => {
            ids.push(e.id_corte);
        })
        const estanpado = await Estanpados.findAll({where:{ id_corte: ids}});
    
        const estanpador = await Estanpador.findAll()
       
    
    
        let data:any = []
     
        for ( let i of estanpado){
    
            let productoNew = produccion_productos.find( h => h.id_corte == i.id_corte);
            let estanpadorNew = estanpador.find( e => e.id == i.id_estanpador);
    
            data = [...data, {estanpado:i, estanpador:estanpadorNew || "", producto:productoNew}];
            
        }
    
    
    
        res.json({
            ok:true,
            data
        })
    } catch (error) {
        res.json({
            ok:false,
            msg:error
        })
    }



}