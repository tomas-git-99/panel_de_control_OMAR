import { Request, Response } from "express";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Producto } from "../../models/ventas/producto";


export const generarOrden = async(req: Request, res: Response) => {


    try {
        const { idCliente, idUsuario } = req.params;


        const datos:any = {
            id_cliente:idCliente,
            id_usuario:idUsuario,
        }

        const orden = new Orden (datos);


        await orden.save();

        res.json({
            ok: true,
            orden
        });
        
    } catch (error) {
            res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
}

export const OrdenDetalles = async (req: Request, res: Response) => {


    try {

    const { id, idProducto } = req.params;

    const { cantidad } = req.body;

    const orden = await Orden.findByPk(id);

    if(!orden){
        res.status(404).json({
            ok: false,
            msg: "NotFound: el id no existe"
        })
    }

    const producto = await Producto.findByPk(idProducto);

    if(!producto){
        res.status(404).json({
            ok: false,
            msg: "NotFound: el id no existe"
        })
    }

    const datos:any = {
        id_orden:id,
        id_producto:idProducto,
        cantidad,
        precio:producto?.precio
    }


    const ordenDetalle = new OrdenDetalle(datos);

    await ordenDetalle.save();


    res.json({
        ok: true,
        ordenDetalle
    })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }

    



}


export const confirmarCompra = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;


        const { body } = req;
    
    
        //ACA TENEMOS QUE GENERAR EL PDF Y SUBIRLO AWS
    
    
        //const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden:id } });
    
    
        const orden = await Orden.findByPk(id);
    
    
        await orden?.update(body);
    
        res.json({
            ok: true,
            orden
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }





}