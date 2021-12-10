import { Request, Response } from "express";
import { Produccion_producto } from "../../models/produccion/productos_produccion";
import { Taller } from "../../models/produccion/talller";






export const crearProducto = async (req: Request, res: Response) => {
    try {

    const producto = new Produccion_producto(req.body);



    await producto.save();
    
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

    await producto?.update(req.body);

    res.json({
        ok: true,
        producto
    })
}

export const obtenerProduccion = async (req: Request, res: Response) => {

    const produccion_productos = await Produccion_producto.findAll();

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

    let taller

    let producto:any = []
    
    if(!productos?.id_taller == null || !productos?.id_taller == undefined){

        taller = await Taller.findByPk(productos?.id_taller);
    }

    producto = [...producto, {producto:productos, taller:taller}]
    res.json({
        ok: true,
        producto,
        taller
    })

}