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