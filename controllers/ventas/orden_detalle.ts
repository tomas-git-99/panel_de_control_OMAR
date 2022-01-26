import { Request, Response } from "express";
import { OrdenDetalle } from "../../models/ventas/orden_detalle";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";



export const modificarOrden = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const { cantidad, talle } = req.body;

        const ordenDetalle = await OrdenDetalle.findByPk(id);

        const productos = await Producto.findByPk(ordenDetalle?.id_producto);

        const talles = await Talle.findAndCountAll({where:{id_producto:ordenDetalle?.id_producto}});
        let productos_sin_stock:any = [];



        //ACA VERIFICAMOS SI CURVA
        if(talle == null) {
            
            //VERIFICAR SI ES POR TALLE O TOTAL
            if(productos?.cantidad == null) {


                let cantidadCurva = cantidad * talles.count


                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!!
                for( let t of talles.rows) {

                    if(t.cantidad < cantidad || t.cantidad == 0){

                        productos_sin_stock.push(`El producto: "${productos?.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad} ` );

                    }
                }

                if(productos_sin_stock.length > 0){
                    return res.json({
                        ok: false,
                        error:2,
                        msg: "No ahi stock suficiente con los productos ...",
                        productos_sin_stock
                    })
                }

                //VERIFICAR BIEN SI ES NECESARIO PONER ESTO ACA O DEBERIA PONERLO ABAJO DONDE CALCULAMOS LAS CANTIDADES QUE SE VAN DESCONTAR CON LA SUMAS HECHAS !!!! FINAL

                let cantidadDescontarPorTalle = ordenDetalle!.cantidad / talles.count;


                if(cantidadDescontarPorTalle > cantidad){

                    let newCantidadCurva = cantidadDescontarPorTalle - cantidad;

                

                    // en esta parte dentri que descontar solo lo que esta en "newCantidadCurva" nada mas

                    for( let t of talles.rows) {

                        let nuevoCantidadTalle = t.cantidad + newCantidadCurva;
                     

                        //ahora solo tenes que hacer update a talle correspospondiente

                    }

    

                }else{

                    let newCantidadCurvaMayor = cantidad - cantidadDescontarPorTalle;


                    for( let t of talles.rows) {

                        let nuevoCantidadTalle = t.cantidad - newCantidadCurvaMayor;

                        //ahora solo tenes que hacer update a talle correspospondiente



                    }

                    // en esta parte dentri que sumar solo lo que esta en "newCantidadCurvaMayor" nada mas

                    console.log(newCantidadCurvaMayor)

                }

 




                res.json({
                    msg:cantidadCurva
                })
            }

        }


        
    } catch (error) {
        
    }

}