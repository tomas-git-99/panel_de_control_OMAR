import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Cliente } from "../../models/ventas/cliente";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Producto } from "../../models/ventas/producto";
import cliente from "../../routers/ventas/cliente";


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

export const ordenDetalles = async (req: Request, res: Response) => {


    try {

    const { idOrden, idProducto } = req.params;

    const { cantidad } = req.body;

    const orden = await Orden.findByPk(idOrden);

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
        id_orden:idOrden,
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


export const buscarOrden = async (req: Request, res: Response) => {



    const buscarOrden = req.query;

    const orden = await Orden.findAll({ where: { id:{ [Op.like]: '%' + buscarOrden.id + '%'} }})


    res.json({
        ok: true,
        orden
    })
}




export const buscarOrdenDNI = async (req: Request, res: Response) => {


    const dni = req.query;

    const cliente:any = await Cliente.findAll({ where:{ dni_cuil :{ [Op.like]: '%' + dni + '%' }}})

    if(!cliente){
        res.json({
            ok: false,
            msg: 'No existe ningun cliente con ese dni'
        })
    }

    const orden = await Orden.findAll({ where:{ id_cliente: cliente.id }})


    if (!orden){
        res.json({
            ok:false,
            msg:"no ahi ninguna orden con ese DNI o CUIL"
        })
    }


    res.json({
        ok:true,
        orden
    })
}

export const confirmarPedido = async (req: Request, res: Response) => {


    const { idOrden } = req.params;

    const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden: idOrden}});

    
    let fullTotal:number = 0;

    await ordenDetalle.map( async(e) => {
        
        //suma y multiplica todas las compras
        const total = e.cantidad * e.precio;

        const producto = await Producto.findByPk(e.id_producto);

        //Descuenta del stock de la base de datos
        if( e.cantidad < producto!.cantidad){

            let actualStock = producto!.cantidad - e.cantidad;
    
            await producto?.update({cantidad:actualStock})

        }else{
            res.json({ 
                ok:true,
                msg: "el producto con el id " + e.id_producto + " no tiene stock suficiente "
            })
        }


        fullTotal = fullTotal + total;

    });




    const orden = await Orden.findByPk(idOrden);


    const body = {
        total: fullTotal,
    }

    await orden?.update(body);

    res.json({
        ok: true,
        orden,
        ordenDetalle
    })

}


