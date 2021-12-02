import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Carrito } from "../../models/ventas/carrito";
import { Producto } from "../../models/ventas/producto";





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

export const mostrarCarrito = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;

        
        const carrito:any = await Carrito.findAll({ where:{id_usuario:id}});


        let idProductos:any = []

        await carrito.forEach( async(e:any) => {
            idProductos.push(e.id_producto)
        });

        const productos:any = await Producto.findAll({where:{id:idProductos}});
        let carrito_full:any = [];
        carrito.map( (e:any, i:any) => {
            productos.find( (r:any, s:any) => {

                if (r.id == e.id_producto){
                    carrito_full = [ ...carrito_full, { carritos:carrito[i], productos:productos[s]}]
                
                }
            })
        })
        
        res.json({
            ok: true,
            carrito_full,
    
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}


export const eliminarCarrito =  async(req: Request, res: Response) => {

    const {id} = req.params;

    const carrito = await Carrito.findByPk(id);


    await carrito?.destroy();


    res.status(200).json({
        ok: true,
        msg:"se elimino con exito"
    })
}