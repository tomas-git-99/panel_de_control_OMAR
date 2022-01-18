import { Request, Response } from "express";
import { Op, where } from "sequelize/dist";
import { Cliente } from "../../models/ventas/cliente";
import { Direccion } from "../../models/ventas/direccion";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Orden_publico } from "../../models/ventas/orden_publico";
import { Producto } from "../../models/ventas/producto";
import cliente from "../../routers/ventas/cliente";
import { ordenarPorFechaExacta } from "../produccion/producto";


export const generarOrden = async(req: Request, res: Response) => {


    try {
        const { idCliente, idUsuario, idDireccion} = req.params;

        const { fecha, transporte} = req.body;

        const datos:any = {
            id_cliente:idCliente,
            id_usuario:idUsuario,
            id_direccion:idDireccion,
            fecha,
            transporte
        }


        const orden = new Orden(datos);


        await orden.save();

        res.json({
            ok: true,
            orden
        });
        
    } catch (error) {
        console.log(error);
            res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador",

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


export const ordenParaImprimir = async (req: Request, res: Response) => {

    
    const { id } = req.params;

    const orden = await Orden.findByPk(id);

    const productos = await OrdenDetalle.findAll({where:{id_orden:id}});



    let ids:any = []


    productos.map( e => {
        ids.push(e.id_producto)
    })


    const detalles_producto = await Producto.findAll({where:{id:ids}})

    const direccion = await Direccion.findByPk(orden?.id_direccion);

    const cliente = await Cliente.findByPk(orden?.id_cliente);

    let para_mi:any = []

    productos.map( e => {
        let data = detalles_producto.find( h => h.id == e.id_producto);

        para_mi = [...para_mi, { producto:data, detalles:e} ]
    })


    console.log(id);

    res.json({
        ok: true,
        orden,
        cliente,
        direccion,
        productos,
        para_mi
    })

}

export const historialOrden = async (req: Request, res: Response) => {

    //const orden = await Orden.findAll({ limit: 10, order: [['updatedAt', 'DESC']]});

    try {
        
        const orden = await Orden.findAll({where:{ total:{ [Op.gt]: 0}},limit:10 , order: [['updatedAt', 'DESC']]});


        //const orden_publico = await Orden_publico.findAll({where:{ total:{ [Op.gt]: 0}},limit:10 , order: [['updatedAt', 'DESC']]});


        

        let id_cliente:any = []
        let id_direccion:any = []
        
        orden.map(async(e, i)=> {
            id_cliente.push(e.id_cliente);
            id_direccion.push(e.id_direccion);
        });
/*         orden_publico.map(async(e, i)=> {
            id_cliente.push(e.id_cliente);
        })
         */
        const cliente = await Cliente.findAll({where:{id:id_cliente}});

        const direccion = await Direccion.findAll({where:{id:id_direccion}});
    
        let datos:any = [];
    
        for ( let i of orden){
    
            let newcliente = cliente.find( e => e.id == i.id_cliente);
            let direcciones = direccion.find( h => h.id == i.id_direccion);
    
            datos = [...datos,{orden:i, cliente:newcliente, direccion:direcciones || ""}];
    
        }

     /*    for( let i of orden_publico){

            let newcliente = cliente.find( e => e.id == i.id_cliente);
    
            datos = [...datos,{orden:i, cliente:newcliente,direccion:""}]
        }
 */
        
        res.json({
            datos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

export const buscarPorID = async (req: Request, res: Response) => {

    const orden = await Orden.findAll({where:{  id: req.query.id, total:{ [Op.gt]: 0}}, order: [['updatedAt', 'DESC']]});

    let id_cliente:any = []
    let id_direccion:any = []
    
    orden.map(async(e, i)=> {
        id_cliente.push(e.id_cliente);
        id_direccion.push(e.id_direccion);
    });


    const cliente = await Cliente.findAll({where:{id:id_cliente}});
    const direccion = await Direccion.findAll({where:{id:id_direccion}});

    let datos:any = [];
    cliente.map( (e,i) => {
        orden.map( (p, m) => {

            let direcciones = direccion.find( h => {
                if (h.id == p.id_direccion){
                    return h;
                }
            });
            
            if( p.id_cliente == e.id){
                datos = [...datos,{orden:orden[m], cliente:cliente[i], direccion:direcciones}];
            }
        })
    })


    res.json({
        datos
    })
}



export const imptimirSoloVentas = async (req: Request, res: Response) => {
    const {id} = req.params;

    const orden_detalle_2 = await OrdenDetalle.findAll({ where:{ id_orden:id } });

    let id_productos:any = []

    orden_detalle_2.map((e) => {
        id_productos.push(e.id_producto)
    })
    const productos = await Producto.findAll({where:{ id:id_productos}, attributes:['id','tela']});

    let orden_detalle:any = []
    productos.map( (e, i) => {

        orden_detalle_2.map( (p,m) => {
            if(e.id == p.id_producto){
                orden_detalle = [...orden_detalle, { orden_detalle: orden_detalle_2[m], productos:productos[i]}]
            }
        })

    })

    res.json({
        ok: true,
        orden_detalle
    })
}



export const generarOrdenPublico = async (req: Request, res: Response) => {


    try {
        
        const { idCliente, idUsuario } = req.params;
    
        const data:any = {
            id_cliente:idCliente,
            id_usuario:idUsuario
        }
    
        const orden = new Orden(data);
    
        await orden.save();
    
        res.json({
            ok: true,
            orden
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }

}


export const deshacerOrden = async(req: Request, res: Response) => {

    try {
        
        const { idOrden } = req.params;

        console.log(idOrden);
        const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden:idOrden }});

        let ids:any = [];

        ordenDetalle.map( (e) => {

            ids.push(e.id_producto)
        })
        const productos = await Producto.findAll({where:{id:ids}});


        for ( let i of ordenDetalle ){


            for ( let e of productos ){

                
                if(e.id == i.id_producto){

                    let nuevoStock:number = e.cantidad + i.cantidad;

                    await e.update({cantidad:nuevoStock});

                    await i.destroy();
                }

            }
            
         

           
            
        }

        const orden = await Orden.findByPk(idOrden);

        await orden?.destroy();

        res.json({
            ok:true
        })


    } catch (error) {
        res.json({
            ok:false,
            msg:error
        })
    }
}