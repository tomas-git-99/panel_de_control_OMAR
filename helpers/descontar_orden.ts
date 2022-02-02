import { Orden } from "../models/ventas/orden";
import { OrdenDetalle } from "../models/ventas/orden_detalle";
import { Producto } from "../models/ventas/producto";
import { Talle } from "../models/ventas/talles";

//CURVAS PARA PRODUCTOS QUE NO TIENE TALLES
export const descontarCurvas = (cantidad:any, cantidad_antigua:any, ordenDetalle:any, orden:any, producto:any, precio:number) =>{

    let cantidadDescontarOsumar

    let cantidadTotalProducto 

    let cantidadTotalOrden

    let largoDeTalle = producto.talles.split(',').length;

    let stockProducto

    let data


    if(cantidad_antigua > cantidad){

        cantidadDescontarOsumar = (cantidad_antigua - cantidad) * largoDeTalle;

        cantidadTotalProducto   = largoDeTalle * cantidad;

        let descontarOrden = orden!.total - (ordenDetalle!.cantidad * ordenDetalle!.precio);
        cantidadTotalOrden = descontarOrden + ((precio == null ? ordenDetalle!.precio : precio) * cantidadTotalProducto);

        if(ordenDetalle!.talle.split(',').length == 1){

            stockProducto = producto.cantidad - (cantidadTotalProducto - ordenDetalle!.cantidad);

            if(producto.cantidad <  (cantidadTotalProducto - ordenDetalle!.cantidad)|| producto.cantidad == 0 ){
                return data = {
                    err : `El producto: "${producto.nombre}" con stock de actual: ${producto.cantidad}, cantidad que quieres colocar: ${ (cantidadTotalProducto - ordenDetalle!.cantidad)} `
                }
            }

        }else{

            stockProducto = producto.cantidad + cantidadDescontarOsumar;

        }


        return data = { 
            cantidadTotalDetalle: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
            productoStock:stockProducto
        }
    }else{

        cantidadDescontarOsumar = (cantidad - cantidad_antigua) * largoDeTalle ;
        cantidadTotalProducto   = largoDeTalle * cantidad;


        if(producto.cantidad < cantidadDescontarOsumar || producto.cantidad == 0 ){
            return data = {
                err : `El producto: "${producto.nombre}" con stock de actual: ${producto.cantidad}, cantidad que quieres colocar: ${cantidadDescontarOsumar} `
            }
        }

        let descontarOrden = orden!.total - (ordenDetalle!.cantidad * ordenDetalle!.precio);
        cantidadTotalOrden = descontarOrden + ((precio == null ? ordenDetalle!.precio : precio) * cantidadTotalProducto);

        if(ordenDetalle!.talle.split(',').length == 1){

            stockProducto = producto.cantidad - (cantidadTotalProducto - ordenDetalle!.cantidad);
        }else{
            stockProducto = producto.cantidad - cantidadDescontarOsumar;

        }


        return data = {
            cantidadTotalDetalle: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
            productoStock: stockProducto
        }

    }



}


//CURVAS QUE TIENEN TALLES POR SEPARADO


export const descontarCurvaTalle = (cantidad:number,talles:Talle[], ordenDetalle:OrdenDetalle, orden:Orden, producto:Producto, precio:number) => {


    let largoDeTalle = talles.length;

    let talleEnProducto = ordenDetalle.talle.split(',').length;

    let tallesDescontar:{talle:number, cantidad:number}[] = [];

    let productos_sin_stock = []

    let cantidaTotalDetalle

    let cantidadTotalOrden

    let data


    if(talleEnProducto == 1){

        for( let t of talles){
            let nuevaCantidadTalle

            if(parseInt(ordenDetalle.talle) == t.talle){

                if(ordenDetalle.cantidad > cantidad){

                    nuevaCantidadTalle = t.cantidad + (ordenDetalle.cantidad - cantidad);

                    tallesDescontar =  [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];             
                }else{

                    nuevaCantidadTalle = t.cantidad - (cantidad - ordenDetalle.cantidad);

                    if(t.cantidad < (cantidad - ordenDetalle.cantidad) || t.cantidad == 0){

                        productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${(cantidad - ordenDetalle.cantidad)} `);
                    }
                    tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];

                }
            }else{
                  
                if(t.cantidad < cantidad || t.cantidad == 0){
                               
                    productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${cantidad} `);
                    
                }

                nuevaCantidadTalle = t.cantidad - cantidad;

                tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];

            }
        }



        cantidaTotalDetalle = largoDeTalle * cantidad;


        cantidadTotalOrden = (( precio == null ? ordenDetalle.precio : precio ) * cantidaTotalDetalle) + (orden.total - (ordenDetalle!.cantidad * ordenDetalle!.precio))

        return data = {

            productosSinStock:productos_sin_stock,
            cantidadTotalDetalle: cantidaTotalDetalle,
            cantidadTotalOrden: cantidadTotalOrden,
            talleStock: tallesDescontar

        }


    }else if (talleEnProducto > 1){

        let cantidadDescontarPorTalle = ordenDetalle.cantidad / largoDeTalle;
        let nuevaCantidadTalle


        if(cantidadDescontarPorTalle > cantidad){

            for(let t of talles){

                nuevaCantidadTalle = t.cantidad + (cantidadDescontarPorTalle - cantidad);
                tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];

            }
        }else{
       

            for(let t of talles){

                if(t.cantidad < (cantidad - cantidadDescontarPorTalle) || t.cantidad == 0){
                    productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${(cantidad - cantidadDescontarPorTalle)} ` );
                    
                }
                nuevaCantidadTalle = t.cantidad - (cantidad - cantidadDescontarPorTalle)

                tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];

            }

        }
        cantidaTotalDetalle = largoDeTalle * cantidad;

        cantidadTotalOrden = (( precio == null ? ordenDetalle.precio : precio ) * cantidaTotalDetalle) + (orden.total - (ordenDetalle!.cantidad * ordenDetalle!.precio))

        return data = {

            productosSinStock:productos_sin_stock,
            cantidadTotalDetalle: cantidaTotalDetalle,
            cantidadTotalOrden: cantidadTotalOrden,
            talleStock: tallesDescontar

        }
    }


}



export const descontarCurvaTalle_talleManda = (cantidad:number, talle:number ,talles:Talle[], ordenDetalle:OrdenDetalle, orden:Orden, producto:Producto, precio:number) =>{
    let largoDeTalle = talles.length;

    let talleEnProducto = ordenDetalle.talle.split(',').length;

    let tallesDescontar:{talle:number, cantidad:number}[] = [];
    let tallesSumar:{}[] = [];

    let productos_sin_stock:any = []

    let cantidaTotalDetalle

    let cantidadTotalOrden

    let data

    if(talleEnProducto == 1){

        if(talle == parseInt(ordenDetalle.talle)){

            let nuevaCantidad


            let cantidadTotalTalle = talles.find( t => t.talle == talle)
            

            if(ordenDetalle!.cantidad > cantidad || ordenDetalle!.cantidad == cantidad){
    
                nuevaCantidad = ordenDetalle.cantidad - cantidad;

                tallesDescontar = [...tallesDescontar, { talle:talle, cantidad:(cantidadTotalTalle!.cantidad + nuevaCantidad)}];
    
            }else{
             

                nuevaCantidad = cantidadTotalTalle!.cantidad - cantidad ;
           
                tallesDescontar = [...tallesDescontar, { talle:talle, cantidad:nuevaCantidad}];

    
            }
        }else{
            let nuevaCantidad

            for(let t of talles){

            

                if(t.talle == talle){
                    
                    if(t.cantidad < cantidad || t.cantidad == 0){
                        productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad } ` );
                    }
                    nuevaCantidad = t.cantidad - cantidad;
                    tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidad}];

                }else if(t.talle == parseInt(ordenDetalle.talle)){

                    nuevaCantidad = t.cantidad + ordenDetalle.cantidad;
                    tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidad}];
                }

            }
        }

        cantidadTotalOrden = ((precio == null ? ordenDetalle!.precio : precio) * cantidad) + (orden.total - (ordenDetalle!.cantidad * ordenDetalle!.precio))



        return data = {
            productosSinStock:productos_sin_stock,
            cantidadTotalOrden: cantidadTotalOrden,
            tallesDescontar:tallesDescontar,
           
        }



    }else if(talleEnProducto > 1){


        for( let t of talles){
            let nuevaCantidad

            if(t.talle == talle){

                if((ordenDetalle.cantidad / largoDeTalle) > cantidad || (ordenDetalle.cantidad / largoDeTalle) == cantidad){
                                
                    nuevaCantidad = (ordenDetalle.cantidad / largoDeTalle) - cantidad;

                    let nuevaCantidadTalle = t.cantidad + nuevaCantidad

                    tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidadTalle}];
            
                }else{

                    nuevaCantidad = cantidad - (ordenDetalle.cantidad / largoDeTalle);
                   
                    if(t.cantidad <  nuevaCantidad || t.cantidad == 0 ){
                        productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${nuevaCantidad} ` );
                    }
            

                    tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:(t.cantidad - nuevaCantidad)}];

                }
            }else{

                nuevaCantidad = t.cantidad + (ordenDetalle.cantidad / largoDeTalle);
                tallesDescontar = [...tallesDescontar, { talle:t.talle, cantidad:nuevaCantidad}];

            }
        }

        cantidadTotalOrden = ((precio == null ? ordenDetalle!.precio : precio) * cantidad) + (orden.total - (ordenDetalle!.cantidad * ordenDetalle!.precio))


        return data = {
            productosSinStock:productos_sin_stock,
            cantidadTotalOrden: cantidadTotalOrden,
            tallesDescontar:tallesDescontar,
        }
    }

}



export const descontarCurva_talleManda = (cantidad:number, talle:number, ordenDetalle:OrdenDetalle, orden:Orden, producto:Producto, precio:number)=>{


    let talleEnProducto = ordenDetalle.talle.split(',').length;

    let tallesDescontar:{talle:number, cantidad:number}[] = [];
 

    let productos_sin_stock:any = []

    let cantidaTotalDetalle

    let cantidadTotalOrden

    let cantidaDeProducto

    let data

    if(talleEnProducto == 1 || talleEnProducto > 1) {
        if(ordenDetalle!.cantidad > cantidad ){

            cantidaTotalDetalle = ordenDetalle!.cantidad - cantidad;

            cantidaDeProducto = producto.cantidad + cantidaTotalDetalle;


        }else{

            cantidaTotalDetalle =  ordenDetalle!.cantidad - cantidad ;

            cantidaDeProducto = producto.cantidad - cantidaTotalDetalle;

            if(producto.cantidad <  cantidaTotalDetalle || producto.cantidad == 0){
                productos_sin_stock.push(`El producto: "${producto.nombre}" con stock de actual: ${producto.cantidad}, cantidad que quieres colocar: ${cantidaTotalDetalle} ` );

            }

        }

        cantidadTotalOrden = ((precio == null ? ordenDetalle!.precio : precio) * cantidad) + (orden.total - (ordenDetalle!.cantidad * ordenDetalle!.precio))
        return data ={
            productosSinStock:productos_sin_stock,
            cantidadTotalOrden: cantidadTotalOrden,
            cantidaDeProducto:cantidaDeProducto
        }


    }}