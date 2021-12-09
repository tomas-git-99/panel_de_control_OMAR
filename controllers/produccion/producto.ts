import { Request, Response } from "express";
import { Produccion_producto } from "../../models/produccion/productos_produccion";






export const crearProducto = async (req: Request, res: Response) => {

    const producto = new Produccion_producto(req.body);

    producto.save();

    res.json({
        ok: true,
        producto
    })
}


export const actualizarProducto = async (req: Request, res: Response) => {

    const { id } = req.params;
    const producto = await Produccion_producto.findByPk(id);

    producto?.update(req.body);

    res.json({
        ok: true,
        producto
    })
}