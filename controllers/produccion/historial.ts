import { Request, Response } from "express";
import { Historial } from "../../models/produccion/historial";
import { Produccion_producto } from "../../models/produccion/productos_produccion";




export const historialTaller = async (req: Request, res: Response) => {
    const { id_taller } = req.params;

    const productos = await Produccion_producto.findAll({where: {id_taller:id_taller}});


    res.json({
        ok: true,
        productos
    });



}