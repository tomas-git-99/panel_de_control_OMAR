import { Request, Response } from "express";
import { Producto } from "../../models/ventas/producto";




export const crearProducto = async (req: Request, res: Response) => {
    try {

        const { nombre, cantidad, local, tela, precio} = req.body;




        const datos = {

            nombre,
            cantidad,
            local,
            tela,
            precio

        }



        const producto = new Producto(datos);
        await producto.save();


        res.json({
            ok: true,
            producto
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
}