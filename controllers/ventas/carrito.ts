import { Request, Response } from "express";
import { Carrito } from "../../models/ventas/carrito";





export const agregarCarrito = async (req: Request, res: Response) => {

    try {
        
            const {id_usuario, id_producto, cantidad } = req.body;
        
        
            const dato:any = {
                id_usuario,
                id_producto,
                cantidad
            }
            const carrito = new Carrito(dato);
        
            await carrito.save();
        
            res.json({
                ok: true,
                carrito
            })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}