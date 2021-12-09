import { Request, Response } from "express";
import { Produccion_producto } from "../../models/produccion/productos_produccion";






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

    const produccion = await Produccion_producto.findAll();


    res.json({
        ok: true,
        produccion
    })
}