import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Carrito } from "../../models/ventas/carrito";
import { Orden } from "../../models/ventas/orden";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";
import producto from "../../routers/ventas/producto";





export const agregarCarrito = async (req: Request, res: Response) => {

    try {
        
            // const {id_usuario, id_producto, cantidad, talle } = req.body;
        
        
            // const dato:any = {
            //     id_usuario,
            //     id_producto,
            //     cantidad, 
            //     talle
            // }
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
    
    
        let idProductos:number[] = []
    
        carrito.map( e => {
            idProductos.push(e.id_producto);

        })
    
        const talle = await Talle.findAll({where:{id_producto:idProductos}});
    
    
    
        talle.map( (e, i) => {
            carrito.map( async(p) => {
    
                if (p.id_producto == e.id_producto){

                    if(e.cantidad < p.cantidad || e.cantidad == 0){
                        return res.json({
                            ok: false,
                            msg: ` el producto con el id ${e.id_producto} no tiene stock suficiente`
                        });
                    }
    
                    let actualizarStock = e.cantidad - p.cantidad
                    await talle[i].update({cantidad: actualizarStock});
                }
            })
        });


        const productos = await Producto.findAll({where:{id:idProductos}});

        productos.map( (e, i) => {

            carrito.map( async(p, c) => {
                if(e.id == p.id_producto){

                    let orden:any = {

                        id_orden,
                        id_producto:p.id_producto,
                        cantidad:p.cantidad,
                        precio: e.precio
                    }

                    let orden_detalle = new OrdenDetalle(orden);

                    await orden_detalle.save()
                        .catch(err => {
                            return res.json({ok: false, msg: err})
                        });

                    await carrito[c].destroy();

                }
            })
        })
    
        res.json({
            ok: true,
            msg: "todo salio correctamente"
        })
    
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

        console.log(productos_sin_stock);


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
                sumaTotal += sumaTotal + nuevaSuma;
                
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

     const orden = await Orden.findByPk(id_orden)

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