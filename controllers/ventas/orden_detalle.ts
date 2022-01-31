import { Request, Response } from "express";
import { descontarCurvas, descontarCurvaTalle, descontarCurvaTalle_talleManda, descontarCurva_talleManda } from "../../helpers/descontar_orden";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";
import { ordenDetalles } from "./orden";



export const modificarOrden = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

       
        const { cantidad, talle } = req.body;

        const ordenDetalle = await OrdenDetalle.findByPk(id);
        const productos = await Producto.findByPk(ordenDetalle?.id_producto);

        const talles = await Talle.findAndCountAll({where:{id_producto:ordenDetalle?.id_producto}});

        const orden = await Orden.findByPk(ordenDetalle?.id_orden);

        let productos_sin_stock:any = [];

        
        //ACA SI LO QUIERE MODIFICAR A CURVO
        if(talle == null) {
            
            //VERIFICAR SI ES POR TALLE O TOTAL
            if(productos?.cantidad == null) {
                
                
                let data = descontarCurvaTalle(cantidad, talles.rows, ordenDetalle!, orden!, productos!)

                if(data!.productosSinStock!.length > 0){
                    return res.json({ 
                        ok: false,
                        error:2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock : data?.productosSinStock
                    })
                }

                for(let t of talles.rows){

                    for(let i of data!.talleStock){

                        if(t.talle == i.talle){

                            //await t.update({cantidad:i.cantidad})
                        }

                    }
                }

                //await ordenDetalle!.update({cantidad:data?.cantidadTotalDetalle, talle:productos?.talles})

                //await orden!.update({total:data?.cantidadTotalOrden})
 



            }else{



                let largoDeTalle:any = ordenDetalle?.talle;
                let cantidadAntigua = ordenDetalle!.cantidad / largoDeTalle.split(',').length;
                let data:any = descontarCurvas(cantidad, cantidadAntigua, ordenDetalle, orden, productos);

                if(data?.err?.length > 0){
                    return res.json({
                        ok: false,
                        error:2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock: data?.err
                    })
                }
                    

              //await ordenDetalle?.update({cantidad:data.cantidadTotalDetalle, talle:productos.talles})
              //await productos?.update({cantidad:data.productoStock})
              //await orden?.update({total:data.cantidadTotalOrden})

            }
            
        }else{

            //ACA ES CUANDO EL USUARIO MANDA EL TALLE Y LA CANTIDAD
            if(productos?.cantidad == null) {
                
                let talleCurvaoTalle:any = ordenDetalle?.talle;

                
                const data = descontarCurvaTalle_talleManda(cantidad, talle, talles.rows, ordenDetalle!, orden!, productos!)
                console.log(data);

                if(data!.productosSinStock!.length > 0){
                    return res.json({ 
                        ok: false,
                        error:2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock : data?.productosSinStock
                    })
                }

                for(let t of talles.rows){

                    for(let i of data!.tallesDescontar){

                        if(t.talle == i.talle){

                            //await t.update({cantidad:i.cantidad})
                        }

                    }
                }

                //await ordenDetalle?.update({cantidad:cantidad, talle:talle})

                //await orden?.update({total:data?.cantidadTotalOrden})


            }else{

                let largoDeTalle:any = ordenDetalle?.talle;
                let data = descontarCurva_talleManda(cantidad, talle, ordenDetalle!, orden!, productos)
                if(data!.productosSinStock!.length > 0){
                    return res.json({ 
                        ok: false,
                        error:2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock : data?.productosSinStock
                    })
                }

                //await ordenDetalle!.update({cantidad:cantidad, talle:talle});

                //await productos.update({cantidad:data?.cantidaDeProducto});

                //await orden?.update ({total:data?.cantidadTotalOrden})
            }
        }
        
        res.json({
            ordenDetalle
        })

        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: error
        })
    }

}


export const ordenDetalleGet = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;

        const ordenDetalle = await OrdenDetalle.findAll({ where:{ id_orden: id } });

        res.json({
            ok:true,
            ordenDetalle
        })
        
    } catch (error) {
        
    }
}




export const agregarOrdenDetalle = async (req: Request, res: Response) => {


    try {
        const { idOrden } = req.params;

        const { id, cantidad, talle } = req.body;

let sumaTotal =0 ;
        let productos_sin_stock:any = [];

        const talles = await Talle.findAll({where:{id_producto:id}});
        const productos = await Producto.findAll({where:{id:id}});

        talles.map( e => {

            if(talle == e.talle){
                if(e.cantidad < cantidad || e.cantidad == 0){
                    if(id == e.id_producto){
                    
                    
                        let dato_producto:any = productos.find( e => e.id == id);

                        productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${cantidad} ` );

                    }
                }else if(talle == null){
                    if(e.cantidad < cantidad || e.cantidad == 0){

                        let dato_producto:any = productos.find( e => e.id == id);

                        productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${cantidad} ` );
                    }

                    }
                }

        });
        productos.map( e => {

       
                if(e.id == id){

                    if(talle == null){

                        let cantidadDeTalle:any = e.talles.split(",");
                        let contador = 0;

                        for(let count of cantidadDeTalle){
                            contador += cantidad;
                        }

                        
                        if(e.cantidad < contador || e.cantidad == 0){
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito(curva): ${contador} ` );
                        }

                       

                    }else{
                       
                        if(e.cantidad < cantidad || e.cantidad == 0){
                            productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${cantidad} ` );
                        }
                    }


                }
            
        });


        if(productos_sin_stock.length > 0){
            return res.json({
                ok: false,
                error:2,
                msg: "No ahi stock suficiente con los productos ...",
                productos_sin_stock
            })
        }
        
        for(let i of productos){

            let Comprobar = talle == null ? false : true;

            if(Comprobar == true){


                for( let t of talles){

                    if(talle == t.talle){

                        let orden:any = {
                        idOrden,
                        id_producto:i.id, 
                        nombre_producto:i.nombre,
                        talle: talle, 
                        cantidad: cantidad,
                        precio: i.precio 
                    }
                    let nuevaSuma = cantidad * i.precio;
                    sumaTotal = sumaTotal + nuevaSuma;

                    let nuevoStock = t.cantidad - cantidad;

                    await t.update({cantidad: nuevoStock});

                    let orden_detalle = new OrdenDetalle(orden);

                    await orden_detalle.save()
                             .catch(err => {
                                 return res.json({ok: false, msg: err})
                             });
                     
                     
                    }

                }
            }else{

                let verdad = talles.some( k => k.id_producto == i.id);
                if(verdad == true){
                    let conteo = 0;


                    for(let t of talles){

                        let nuevaSuma = cantidad * i.precio;
    
                        sumaTotal = sumaTotal + nuevaSuma;

                        await t.update({cantidad:t.cantidad - cantidad});
                        conteo += cantidad;

                    }


                    let orden:any = {

                        idOrden,
                        id_producto:i.id, 
                        nombre_producto:i.nombre,
                        talle: i.talles, 
                        cantidad: conteo,
                        precio: i.precio 
                    };

                    let orden_detalle = new OrdenDetalle(orden);
    
                    await orden_detalle.save()
                            .catch(err => {
                                return res.json({ok: false, msg: err})
                            });
                }

            }
        }




        for( let i of productos){

            if(i.talles !== null){



                if(talle == null){
                   let cantidadDeTalle:any = i.talles.split(",");
                   let contadorTotal = 0;

                   for (let count of cantidadDeTalle){
                    contadorTotal += i.cantidad;
                }

                let orden:any = {
    
                    idOrden,
                    id_producto:i.id,
                    nombre_producto:i.nombre,
                    talle:i.talles,
                    cantidad:contadorTotal,
                    precio: i.precio
                }


                let nuevaSuma:any = contadorTotal * i.precio;
                sumaTotal = sumaTotal + nuevaSuma;

                let nuevoStock = i.cantidad - contadorTotal;
              


                await i.update({cantidad:nuevoStock});

                let orden_detalle = new OrdenDetalle(orden);

                await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });

                }
            }else{

                let orden:any = {
    
                    idOrden,
                    id_producto:i.id,
                    nombre_producto:i.nombre,
                    talle:talle,
                    cantidad:cantidad,
                    precio: i.precio
                }
                let nuevaSuma:any = cantidad * i.precio;

                sumaTotal = sumaTotal + nuevaSuma;

                let nuevoStock = i.cantidad - cantidad;
                
            

                await i.update({cantidad:nuevoStock});


                let orden_detalle = new OrdenDetalle(orden);

                await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });

            }
        }




    let ordenTotal = await Orden.findByPk(idOrden);


    await ordenTotal?.update({total:ordenTotal.total + sumaTotal})





    } catch (error) {
        
    }
}