import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { iLike } from "sequelize/dist/lib/operators";
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
       


     if(req.body.talle == null || req.body.talle == undefined ){

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
        

        let productos_sin_stock:any = [];
        
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


/*         console.log(ids_productos_total);
        console.log(ids_productos_unidad);


        let valor = ids_productos_total.some((h:any) => h == 2);

        console.log(valor);
 */

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

        let verificar_si_estaRepetido:any = []
        carrito.map( e => {
            ids_productos_total.map( (i:any) => {

                if(e.id_producto == i.id){
                    verificar_si_estaRepetido = [...verificar_si_estaRepetido, {id_producto:e.id_producto, cantidad:e.cantidad}]
                }
            })
        });

        //VERIFICAR SI EN EL CARRIO AHI PRODUCTOS DUPLICADOS PARA LOS PRODUCTOS QUE NO ESTAN ACOMODADOS POR TALLE

        const miCarritoSinDuplicados = verificar_si_estaRepetido.reduce((acumulador:any, valorActual:any) => {

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
          },[]);

        

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
                error:2,
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
                        sumaTotal = sumaTotal + nuevaSuma;
                        let nuevoStock = e.cantidad -n.cantidad;

                        await e.update({cantidad:nuevoStock})
                                    .catch(err => {
                                        return res.json({ok: false, msg: err})
                                    });
                        let orden_detalle = new OrdenDetalle(orden);

                        await orden_detalle.save()
                                .catch(err => {
                                    return res.json({ok: false, msg: err})
                                });
    
                        await n.destroy().catch( err => {
                            return res.json({ok: false, msg: err})
                        })
                    }else if(n.talle == null){

                        let filtroDeTalles = talles.filter(p => p.id_producto == n.id_producto);
                        let dato_producto:any = productos.find( j => j.id == n.id_producto);

                        let canitdadTotalTalle = 0;

                        for(let f of filtroDeTalles){

                           /*  console.log(f) */

                            canitdadTotalTalle += n.cantidad;

                            let nuevaSuma = n.cantidad * dato_producto.precio;
                            sumaTotal = sumaTotal + nuevaSuma;
                            let nuevoStock = e.cantidad - n.cantidad;

                            await f.update({cantidad:nuevoStock})
                            .catch(err => {
                                return res.json({ok: false, msg: err})
                            });
                        }

                        let orden:any = {
                            id_orden,
                            id_producto:n.id_producto, 
                            nombre_producto:dato_producto.nombre,
                            talle: dato_producto.talles, 
                            cantidad: canitdadTotalTalle,
                            precio: dato_producto.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                        };

                        let orden_detalle = new OrdenDetalle(orden);

                        await orden_detalle.save()
                                .catch(err => {
                                    return res.json({ok: false, msg: err})
                                });
    
                        await n.destroy().catch( err => {
                            return res.json({ok: false, msg: err})
                        })


                    }
                }
            }
        }



        
        for(let p of carrito){

    
            let valor = ids_productos_total.filter((h:any) => h.id == p.id_producto);
            let valor_true = ids_productos_total.some((h:any) => h.id == p.id_producto);

            
            
            
            
            
            
            if( valor_true ){
                let producto = productos.filter( e => e.id == valor[0].id);
            if(producto.length > 0){

              

                    let orden:any = {
    
                        id_orden,
                        id_producto:p.id_producto,
                        nombre_producto:producto[0].nombre,
                        talle:p.talle,
                        cantidad:p.cantidad,
                        precio: producto[0].precio
                    }


    
    
                    let nuevaSuma = p.cantidad * producto[0].precio;
                  
                    sumaTotal = sumaTotal + nuevaSuma;
                 
                    let nuevoStock = producto[0].cantidad - p.cantidad ;
    
                    await producto[0].update({cantidad: nuevoStock})
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });
    
                    let orden_detalle = new OrdenDetalle(orden);
                    await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });

                   
    
                    await p.destroy();
                  
                }


            }


    }



        

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



export const pruebaParaDescontar = async(req: Request, res: Response ) => {

    try {
        
        const { id, id_orden} = req.params;

        

        //BUSCANDO LOS PROUDCTOS DEL CARRITO DEL USUARIO
        const carrito = await Carrito.findAll({where:{id_usuario:id}});


        let ids_productos:any = [];
        let sumaTotal = 0;

        carrito.map( e => {
            ids_productos.push(e.id_producto);
        });

        const productos = await Producto.findAll({where:{id:ids_productos}});


        //FILTRAR LOS CARRITOS POR TALLES O CANTIDADES


        //EL PRODUCTO QUE VIENE CON SOLO CANTIDAD TOTAL 
        let ids_productos_total:any =  []; 
        //EL PRODUCTO VIENE CON TALLES Y CANTIDAD INDIVIDUAL
        let ids_productos_unidad = [];

        for (let i of productos){

            if( i.cantidad == null){

                ids_productos_unidad.push(i.id);

            }else{

                ids_productos_total.push(i)
            }
        }

        let productos_sin_stock:any = [];

        const talles = await Talle.findAll({where:{id_producto:ids_productos_unidad}});

        talles.map( e => {

            carrito.map ( p => {



                

                if(p.id_producto == e.id_producto){
                    if(p.talle == e.talle){
                        if(e.cantidad < p.cantidad || e.cantidad == 0){

                           
                            let dato_producto:any = productos.find( e => e.id == p.id_producto);

                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );

                        }
                    }else if(p.talle == null){
                        if(e.cantidad < p.cantidad || e.cantidad == 0){

                            let dato_producto:any = productos.find( e => e.id == p.id_producto);

                            productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );
                        }

                    }
                }



            })
        });


        console.log()




        //DESCONTAR POR TALLES Y CANTIDAD INDIVIDUAL


   /*      for( let i of productos){

            
         
            let carritoComprobar = carrito.some( h => {
                if(h.id_producto == i.id) return h.talle == null ? false : true;
            });

            //DESCONTAR POR TALLE
            if(carritoComprobar == true){

                let tallesPrueba = talles.filter( p => p.id_producto == i.id ? p : undefined)
              
                
                 for (let t of tallesPrueba ){
                   
                    let carritoNoCurva = carrito.filter( h => h.id_producto == i.id ?? h);

                    for( let ca of carritoNoCurva){

                        if(ca.talle == t.talle ){

                            let dato_producto:any = productos.find( e => e.id == i.id);

                            let orden:any = {
                                id_orden,
                                id_producto:ca.id_producto, 
                                nombre_producto:dato_producto.nombre,
                                talle: ca.talle, 
                                cantidad: ca.cantidad,
                                precio: dato_producto.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                            }
    
                            let nuevaSuma = ca.cantidad * dato_producto.precio;
                            sumaTotal = sumaTotal + nuevaSuma;
                            let nuevoStock = t.cantidad - ca.cantidad;

                            await t.update({cantidad: nuevoStock});

                            let orden_detalle = new OrdenDetalle(orden);

                            await orden_detalle.save()
                                    .catch(err => {
                                        return res.json({ok: false, msg: err})
                                    });
                            

                            await ca.destroy();

                        }
                        
                    }
                    
                 }

            }else{
                let tallesUnicoCurva = talles.filter( t => t.id_producto == i.id);

                let carritoCurva = carrito.find( t => t.id_producto == i.id);

                let conteo = 0;
           

                for(let o of tallesUnicoCurva){
                    let nuevaSuma = carritoCurva!.cantidad * i.precio;

                    sumaTotal = sumaTotal + nuevaSuma;

                    await o.update({cantidad:o.cantidad - carritoCurva!.cantidad});

                    conteo += carritoCurva!.cantidad;
                }


                let orden:any = {
                    id_orden,
                    id_producto:i.id, 
                    nombre_producto:i.nombre,
                    talle: i.talles, 
                    cantidad: conteo,
                    precio: i.precio //PARA MODIFICAR EL PRECIO SERIA : n.nuevo_precio !== null ? n.nuevo_precio : dato_producto.precio
                };

                let orden_detalle = new OrdenDetalle(orden);

                await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });
                await carritoCurva?.destroy()
                                
            }
            
        }
        
        
        //FILTRAR LOS PRODUCTOS DE SOLO POR CANTIDAD TOTAL 


        for ( let c of ids_productos_total){

           let carritoCurva = carrito.filter( e => e.id_producto == c.id ? e : undefined);

           for ( let i of carritoCurva){

               if(i.talle == null) {
                   let productoCurva = productos.find( o => o.id == i.id_producto ? o : undefined);
                   let cantidadDeTalle:any = productoCurva?.talles.split(",");
                   let contadorTotal = 0;

                   for (let count of cantidadDeTalle){
                       contadorTotal += i.cantidad;
                   }

                   let orden:any = {
    
                    id_orden,
                    id_producto:productoCurva?.id,
                    nombre_producto:productoCurva?.nombre,
                    talle:productoCurva?.talles,
                    cantidad:contadorTotal,
                    precio: productoCurva?.precio
                }

                let nuevaSuma = contadorTotal * productoCurva!.precio;
                sumaTotal = sumaTotal + nuevaSuma;

                let nuevoStock = productoCurva!.cantidad - contadorTotal;

                await productoCurva?.update({cantidad:nuevoStock});

                let orden_detalle = new OrdenDetalle(orden);

                await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });


                await i.destroy();

               }else{
                let productoCurva = productos.find( o => o.id == i.id_producto ? o : undefined);
                let orden:any = {
    
                    id_orden,
                    id_producto:i.id_producto,
                    nombre_producto:productoCurva?.nombre,
                    talle:i.talle,
                    cantidad:i.cantidad,
                    precio: productoCurva?.precio
                }


                let nuevaSuma = i.cantidad * productoCurva!.precio;
                sumaTotal = sumaTotal + nuevaSuma;

                let nuevoStock = productoCurva!.cantidad - i.cantidad;

                await productoCurva?.update({cantidad:nuevoStock});


                let orden_detalle = new OrdenDetalle(orden);

                await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });

                await i.destroy();

                
               }
           }
        }

        console.log(sumaTotal);
        const orden = await Orden.findByPk(id_orden);
        await orden!.update({total:sumaTotal});


        res.json({
            ok: true,
            msg: "Su compra fue exitosa"
         }) */


    } catch (error) {
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }


}