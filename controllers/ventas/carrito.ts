import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Carrito } from "../../models/ventas/carrito";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Orden_publico } from "../../models/ventas/orden_publico";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";
import producto from "../../routers/ventas/producto";





export const agregarCarrito = async (req: Request, res: Response) => {

    try {
        const verificar = await Carrito.findAll({where:{[Op.and]:[{id_usuario:req.body.id_usuario}, {id_producto:req.body.id_producto}]}});

       
        let cantidadBody = parseInt(req.body.cantidad);

        const talle = parseInt(req.body.talle);
  

        for( let e of verificar){

            if(e.talle == talle){
              
                let nuevaCantidad = cantidadBody + e.cantidad;
                await e.update({cantidad: nuevaCantidad});
             
                return res.json({
                     ok: true,
                  
                 });
                
         }
        }
       


     if(req.body.talle == null || req.body.talle === undefined ){

        for( let e of verificar){
            if(e.talle == null){
               
                let nuevaCantidad = cantidadBody + e.cantidad;
                await e.update({cantidad:nuevaCantidad})
                return res.json({
                    ok: true,
            
                });
                
            }
        }
    }
                
  
    const carrito = new Carrito(req.body);
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



export const descontarPorUnidad = async(req: Request, res: Response) => {


    try {
        const { id, id_orden } = req.params;

        //CON middleware VAMOS A COMPROBAR SI EL ID DE ESE USUARIO ES VALIDO
    
    
        const carrito = await Carrito.findAll({where:{id_usuario:id}});
    
        let sumaTotal = 0;
    
        let idProductos:number[] = []

        let talleProducto:number[] = []
        carrito.map( e => {
            idProductos.push(e.id_producto);
            talleProducto.push(e.talle)
        });


        const talle = await Talle.findAll({where:{id_producto:idProductos}});

        const productos = await Producto.findAll({where:{id:idProductos}});
        

        let productos_sin_stock:any = []
        
        let stockDisponible = talle.map( e => {
            carrito.map(p => {
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
        })

        if(productos_sin_stock.length > 0){
            return res.json({
                ok: false,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            })
        }

        for( let e of talle){

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
                            precio: dato_producto.precio
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



        const orden = await Orden.findByPk(id_orden);
        await orden!.update({total:sumaTotal});


        res.json({
            ok: true,
            msg: "Su compra fue exitosa"
        });
    
    } catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }


}


export const descontarElTotal= async(req: Request, res: Response) => {
    try {

        const { id, id_orden } = req.params;

        const carrito = await Carrito.findAll({where:{id_usuario:id}});

        let sumaTotal = 0;

        let idProductos:number[] = []
        let datos:number[] | any  = []
    
        carrito.map( e => {
            idProductos.push(e.id_producto);
            datos = [...datos, {id_producto:e.id_producto, cantidad:e.cantidad}]
        });

        const productos = await Producto.findAll({where:{id:idProductos}});


        //PRIMERO VERIFICAR SI AHI STOCK EN CADA PRODUCTO

        let productos_sin_stock:any = []

        let stock_disponible = productos.map( e => {
            carrito.map( p => {
                if(e.id == p.id_producto){
                    if(e.cantidad < p.cantidad || e.cantidad == 0){
                        productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );
                    }
                }
            })
        });


        if(productos_sin_stock.length > 0){
            return res.json({
                ok: false,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            })
        }

        //FIN PRIMERO VERIFICAR SI AHI STOCK EN CADA PRODUCTO



    //DESCONTANDO PRODUCTO DE STOCK TOTAL
    productos.map( (e, i) => {

        carrito.map( async(p, c) => {

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

     // FIN DESCONTANDO PRODUCTO DE STOCK TOTAL

  
    
    
    

    

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






const eliminarCarritoYagregarAorden = async(id_usuario:number) => {

}



export const modificarCarrito = async(req: Request, res: Response) => {

    const { id } = req.params

    const carrito = await Carrito.findByPk(id);


    await carrito?.update(req.body);

    const cantidad = carrito?.cantidad;

    res.json({
        ok: true,
        cantidad
    })
}
export const mostrarCantidad_Actual_Carrito = async(req: Request, res: Response) => {

    const { id } = req.params

    const carrito = await Carrito.findByPk(id);

    const producto = await Producto.findByPk(carrito?.id_producto);

    const cantidadActual = producto?.cantidad;

    const cantidadCarrito = carrito?.cantidad;


    res.json({ 
        ok: true,
        cantidadActual,
        cantidadCarrito
    })


}