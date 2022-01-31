import { Request, Response } from "express";
import fecha from "fecha";
import { Op, where } from "sequelize/dist";
import { Carrito } from "../../models/ventas/carrito";
import { Cliente } from "../../models/ventas/cliente";
import { Direccion } from "../../models/ventas/direccion";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Orden_publico } from "../../models/ventas/orden_publico";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";
import cliente from "../../routers/ventas/cliente";
import { ordenarPorFechaExacta } from "../produccion/producto";


export const generarOrden = async(req: Request, res: Response) => {


    try {
        const { idCliente, idUsuario, idDireccion} = req.params;

        let { fecha, transporte} = req.body;



        if(fecha == ''){
            fecha = null
        }

        if(transporte == '' || transporte == undefined){
            transporte = null;
        }

        const datos:any = {
            id_cliente:  idCliente,
            id_usuario:  idUsuario,
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

            res.json({
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
    
            datos = [...datos,{orden:i, cliente:newcliente || "", direccion:direcciones || ""}];
    
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


    const clienteDNI = await Cliente.findAll({where:{  dni_cuil: req.query.id}, order: [['updatedAt', 'DESC']]});

    let ids_clientesDNI:any = [];

    clienteDNI.forEach( e => {
        ids_clientesDNI.push(e.id)
    })

    const orden = await Orden.findAll({where:{  id_cliente: ids_clientesDNI, total:{ [Op.gt]: 0}}, order: [['updatedAt', 'DESC']]});

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
                datos = [...datos,{orden:orden[m], cliente:cliente[i], direccion:direcciones || ""}];
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

        
        const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden:idOrden }});

        let ids:any = [];

        ordenDetalle.map( (e) => {

            ids.push(e.id_producto)
        })
        const productos = await Producto.findAll({where:{id:ids}});

        let ids_productos_total =  []; 
        let ids_productos_unidad = [];

        for (let i of productos){

            if( i.cantidad == null){

                ids_productos_unidad.push(i.id);

            }else{

                ids_productos_total.push(i)
            }
        }


     

        const talles = await Talle.findAll({where:{id_producto:ids_productos_unidad}});


        for( let i of ordenDetalle){

            let tallesFilter = talles.filter( h => h.id_producto == i.id_producto);


            for(let h of tallesFilter){

                let largo:any = i.talle;
                let largoDetalle = largo.length;


                if(largo.length == 1){

                    if(h.talle == parseInt(i.talle)){

                        let nuevaCantidad = h.cantidad + i.cantidad;

                        await h.update({cantidad:nuevaCantidad});
                    
                        await i.destroy();
                        
                    }

                }else if(largo.length > 1){

                    let filtrarTalles = talles.filter( h => h.id_producto == i.id_producto);

                    let calcularCantidadPorunidad = i.cantidad / filtrarTalles.length;

                    let nuevaCantidad = h.cantidad + calcularCantidadPorunidad;

                    await h.update({cantidad:nuevaCantidad});

                    await i.destroy();

               
                    
                }else{
                   
                    return res.json({
                        ok: false,
                        msg: "Hablar con el administrador"
                    })
                }


            }

            let verdad = ids_productos_total.some( e => e.id == i.id_producto);

            if(verdad == true){
               let largoTalle:any = i.talle;

               let productoTotal = productos.find( p => p.id == i.id_producto);

               let nuevaCantidad = productoTotal!.cantidad + i.cantidad;

               await productoTotal?.update( {cantidad:nuevaCantidad});
               
               await i.destroy();

            }

            

        }

   

        const orden = await Orden.findByPk(idOrden);
        await orden?.destroy();


        Direccion.findByPk(orden?.id_direccion)
                .then( async(resp) => {
                    if(resp){
                        await resp.destroy();
                    }
                })

        const cliente = await Cliente.findByPk(orden?.id_cliente);

        await cliente?.destroy();
        

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




export const modificarOrden_detalle = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;

        const { cantidad } = req.body;

        const orden_detalle:any = await OrdenDetalle.findByPk(id);

        const producto:any = await Producto.findByPk(orden_detalle?.id_producto);


        if(producto?.estado == false){
            return res.json({
                ok: false,
                msg:'El producto ya no existe en el catalogo'
            })
        }

        let cantidadNumber = parseInt(cantidad);

        //Verificar si la cantidad que mandad es mayor o meno a la cantidad de la DB

        let newCantidad:number = 0;

        let cantidaParaProducto:number = 0;

        let cantidadOrden:number = 0;

        if( orden_detalle?.cantidad > cantidadNumber){

            newCantidad = cantidadNumber - orden_detalle.cantidad;

            if( producto.cantidad < newCantidad){
                return res.json({
                    ok:true,
                    msg:'No ahi stock suficiente de este producto, stock actual del producto: ' + producto.cantidad

                })
            }

            cantidaParaProducto = producto.cantidad - newCantidad;

            cantidadOrden = orden_detalle.cantidad + newCantidad;

            if( orden_detalle.talle !== null){

                let talle = await Talle.findByPk(orden_detalle.talle);

                
            }



        }



    } catch (error) {
        
    }
}





export const descontarProductosFull = async (req: Request, res: Response) => {

    try {
        //RECIVIMOS EL ID DEL USUARIO PARA DESCONTAR

        const { id, id_orden} = req.params;

        const carrito = await Carrito.findAll({where:{id_usuario:id}});

        let ids_productos:any = [];
        let sumaTotal = 0;

        carrito.map( e => {
            ids_productos.push(e.id_producto);
        });

        const productos = await Producto.findAll({where:{id:ids_productos}});

        //VERIFICAMOS SI EL PRODUCTO ES PARA DESCONTAR POR TALLE O EL TOTAL


        let ids_productos_total:any =  []; 
        let ids_productos_unidad = [];

        for (let i of productos){

            if( i.cantidad == null){

                ids_productos_unidad.push(i.id);
            }else{

                ids_productos_total.push(i)
            }
        }

        // VERIFICAR SI TIENE STOCK SUFICIENTE EN LA BASE DE DATOSAAA
        let productos_sin_stock:any = [];
        const talles = await Talle.findAll({where:{id_producto:ids_productos_unidad}});

        talles.map( e => {

            carrito.map ( p => {

                if(p.id_producto == e.id_producto){
                    if(p.talle == e.talle){
                        if(e.cantidad < p.cantidad || e.cantidad == 0){

                            //let nombre_producto:any = productos.map( n => n.id == e.id_producto ?? n);
                            let dato_producto:any = productos.find( e => e.id == p.id_producto);

                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );

                        }
                    }
                }

            })
        });


        //VERIFICAR SI EN EL CARRIO AHI PRODUCTOS DUPLICADOS PARA LOS PRODUCTOS QUE NO ESTAN ACOMODADOS POR TALLE
        const miCarritoSinDuplicados = ids_productos_total.reduce((acumulador:any, valorActual:any) => {

            const elementoYaExiste = acumulador.find((elemento:any) => elemento.id_producto === valorActual.id_producto);
            if (elementoYaExiste) {
              return acumulador.map((elemento:any) => {
                if (elemento.id_producto === valorActual.id_producto) {
                  return {
                    ...elemento,
                    cantidad: elemento.cantidad + valorActual.cantidad
                  }
                }
          
                return elemento;
              });
            }
          
            return [...acumulador, valorActual];
          }, []);




        productos.map( e => {
            miCarritoSinDuplicados.map( (p:any) => {
                if(e.id == p.id_producto){
                    if(e.cantidad < p.cantidad || e.cantidad == 0){
                        productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );
                    }
                }
            })
        });


        //ALERTA DE STOCK
        if(productos_sin_stock.length > 0){
            return res.json({
                ok: false,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            })
        }



        for( let e of talles){

            for( let n of carrito){

                if(e.id_producto == n.id_producto){

                    if(e.talle == n.talle){

                        let dato_producto:any = productos.find( e => e.id == n.id_producto);

                        let orden:any = {
                            id_orden,
                            id_producto:n.id_producto, 
                            nombre_producto:dato_producto.nombre,
                            talle: n.talle, 
                            cantidad: n.cantidad,
                            precio: dato_producto.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                        }

                        let nuevaSuma = n.cantidad * dato_producto.precio;
                        sumaTotal += sumaTotal + nuevaSuma;
                        let nuevoStock = e.cantidad -n.cantidad ;

                        await e.update({cantidad:nuevoStock})
                                    .catch(err => {
                                        return res.json({ok: false, msg: err})
                                    });
                        let orden_detalle = new OrdenDetalle(orden);

                        await orden_detalle.save()
                                .catch(err => {
                                    return res.json({ok: false, msg: err})
                                });
    
                        await n.destroy();
                    }
                }
            }
        }

        productos.map( (e, i) => {

            ids_productos_total.map( async(p:any, c:any) => {
    
                if(e.id == p.id_producto){
    
                    let orden:any = {
    
                        id_orden,
                        id_producto:p.id_producto,
                        nombre_producto:e.nombre,
                        talle:p.talle,
                        cantidad:p.cantidad,
                        precio: e.precio
                    }
    
                    let nuevaSuma = p.cantidad * e.precio;
                  
                    sumaTotal += nuevaSuma;
                 
                    let nuevoStock = e.cantidad - p.cantidad ;
    
                    await productos[i].update({cantidad: nuevoStock})
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });
    
                    let orden_detalle = new OrdenDetalle(orden);
                    await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });
    
                    await carrito[c].destroy();
    
                }
            })
        });



        const orden = await Orden.findByPk(id_orden);
        await orden!.update({total:sumaTotal});


        res.json({
            ok: true,
            msg: "Su compra fue exitosa"
         })




    } catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}