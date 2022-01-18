import { query, Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Estanpados } from "../../models/produccion/estanpados";
import { Produccion_producto } from "../../models/produccion/productos_produccion";
import { Taller } from "../../models/produccion/talller";



export const crearProducto = async (req: Request, res: Response) => {
    try {

    const producto = new Produccion_producto(req.body);

    const estado = req.query.estado;


    await producto.save();


    if(estado == "true"){

        const data:any = {
            id_corte:req.body.id_corte
        }

        const estanpados = new Estanpados(data);

        await estanpados.save();

    }
    
    res.json({
         ok: true,
         producto
    })
        
    } catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        })
    }
        
}


export const actualizarProducto = async (req: Request, res: Response) => {

    const { id } = req.params;

    const producto = await Produccion_producto.findByPk(id);


    let dato = req.body;
    const { estado } = req.body;
    let nombre = Object.keys(dato);

    if(nombre[0] == "total_por_talle"){

        let newTotal:number = producto!.talles * dato.total_por_talle;
        await producto?.update({total: newTotal});
    }
    if( nombre[0] == "talles" ){
        let newTotal:number = dato.talles * producto!.total_por_talle;
        await producto?.update({total: newTotal});
    }

    if( estado == false){
        let dato_verdad:any = null
        await producto?.update({fecha_de_pago:dato_verdad})
    }

    await producto?.update(req.body);

    res.json({
        ok: true,
        producto
    })
}


export const obtenerProduccion = async (req: Request, res: Response) => {

    const produccion_productos = await Produccion_producto.findAll({order: [['updatedAt', 'DESC']]});

    const taller = await Taller.findAll()

    let produccion:any = []
    
    produccion_productos.map ( (e, i) =>{
        taller.map ( (p,m) => {
            if(e.id_taller == p.id){
                produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
            }

        })
        if(e.id_taller === null){

            produccion = [...produccion, {produccion:produccion_productos[i]}];
        }
    })

    res.json({
        ok: true,
        produccion
    })
}

export const obetenerUnProducto = async (req: Request, res: Response) => {


    const { id } = req.params;


    const productos = await Produccion_producto.findByPk(id);

    let taller = await Taller.findByPk(productos?.id_taller);

    let producto:any = []

    
    producto = [...producto, {producto:productos, taller:taller || ""}]

    res.json({
        ok: true,
        producto,
        taller
    })

};


//["2021-12-12", "2021-12-11"]

export const ordenarPorRango = async (req: Request, res: Response) => {

    const { fecha } = req.body;
    const { query } = req.params;


    let valor:any = {[Op.between]:[fecha[0], fecha[1]]};    
 
    searchFunc(query, valor)
    .then( produccion => {
        return res.json({
            ok: true,
            produccion
        })
    })
    .catch( error => {
        return res.json({
            ok: false,
            msg: error
        })
    })
 

}

export const ordenarPorFechaExacta = async (req: Request, res: Response) => {

    const { fecha } = req.body;

    const { query } = req.params;


    searchFunc(query, fecha)
    .then( produccion => {
        return res.json({
            ok: true,
            produccion
        })
    })
    .catch( error => {
        return res.json({
            ok: false,
            msg: error
        })
    })
 
}

export const unicoDatoQuery = async (req: Request, res: Response) =>{

    try {
        const { query } = req.params;

    
        let valor:null | false = null
    
        if(query == "estado"){
            valor = false
        }
    
    
        searchFunc(query, valor)
            .then( produccion => {
                return res.json({
                    ok: true,
                    produccion
                })
            })
            .catch( error => {
                return res.json({
                    ok: false,
                    msg: error
                })
            })
        
    } catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        })
    }
    
}

const searchFunc = async(palabra:any, valor: false | null | number) =>{

    let buscar:any = {
        where: {

        },order: [['updatedAt', 'DESC']]
    }

    buscar.where[`${palabra}`] = valor;

    const produccion_productos = await Produccion_producto.findAll(buscar);
    const taller = await Taller.findAll()
        
    let produccion:any = []

         produccion_productos.map ( (e, i) =>{
             taller.map ( (p,m) => {
                 if(e.id_taller == p.id){
                     produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                 }
    
             })
             if(e.id_taller === null){
    
                 produccion = [...produccion, {produccion:produccion_productos[i]}];
             }
         })

    return produccion;

}


export const buscar = async (req: Request, res: Response) => {

    const dato = req.query;

    const produccion_productos = await Produccion_producto.findAll({ where:{ 
        nombre:{ [Op.like]: '%'+ dato.nombre +'%'},
        // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
    }});

    const taller = await Taller.findAll()
    let produccion:any = []
    
    produccion_productos.map ( (e, i) =>{
        taller.map ( (p,m) => {
            if(e.id_taller == p.id){
                produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
            }

        })
        if(e.id_taller === null){

            produccion = [...produccion, {produccion:produccion_productos[i]}];
        }
    })

    res.json({
        ok:true,
        produccion
    })

}