import { Carrito } from "../models/ventas/carrito";
import { OrdenDetalle } from "../models/ventas/orden_detalle";
import { Producto } from "../models/ventas/producto";
import { Talle } from "../models/ventas/talles";

interface Productos{
    id_producto:number,
    talles     :number[],
}
interface ProductoSinDuplicados{
    id_producto:number,
    talle      :number,
    cantidad   :number,
}


export const armarLasCurvas = (carrito:Carrito[], talles:Talle[]):ProductoSinDuplicados[] => {

  /* try { */

    let nuevosCurvas:ProductoSinDuplicados[] = [];

    carrito.map( e => {
      if(e.talle == null && talles.some( h => h.id_producto == e.id_producto)){

        let totalTalle = talles.filter( h => h.id_producto == e.id_producto).map( p => p.talle);
        totalTalle.map( talle => {
          nuevosCurvas = [...nuevosCurvas, {id_producto:e.id_producto, talle:talle, cantidad:e.cantidad}];
        })
      }else{
          nuevosCurvas = [...nuevosCurvas, {id_producto:e.id_producto, talle:e.talle, cantidad:e.cantidad}];

      }

    })

    return nuevosCurvas;

/*   } catch (error) {

  } */
}

export const juntarTodosLosTallesEnUno = (ids_productos:any[], carrito:any[]):Productos[]  => {

let idsTalle:Productos[] = []


ids_productos.map( e => {

    carrito.map((carritos) => {
  
      if( e == carritos.id_producto && carritos.talle !== null){
  
        if(idsTalle.some( p => p.id_producto == e) == true ){
  
          if(idsTalle.find(l => l.id_producto == e)!.talles.every( (o:any) => o !== carritos.talle) == true){
            idsTalle.find( (h:any) => h.id_producto == e)!["talles"].push(carritos.talle)
  
          }
                
  
        }else{
          idsTalle.push({ id_producto:e, talles:[carritos.talle]})
  
        }
    
    
      }
    })
  })

  return idsTalle;
}

export const sumaDeTodoLosProductos = (idsTalles:Productos[], carrito:any[]) => {

    let listaDeProductosSinRepetir:ProductoSinDuplicados[] = []

    for( let id of idsTalles){

        let id_producto_seleccionado:number[][] = idsTalles.filter((g) => g.id_producto == id.id_producto).map( (t) => t.talles);
        
        id_producto_seleccionado[0].map( (f) => {
          
          let nuevaCantidada = carrito
          .filter( r => r.id_producto == id.id_producto && f == r.talle)

          let cantidad = 0;

          for(let ca of nuevaCantidada){
            cantidad += ca.cantidad;
          }
          listaDeProductosSinRepetir.push({id_producto:id.id_producto,  talle:f, cantidad:cantidad});

       
        })
        }
    return listaDeProductosSinRepetir;
}



/* function sumarTodo ( uno:any, dos:any ){
  return uno + dos
} */
export const creandoOrdenDetallePorTalle = ( productosSinRepetir:ProductoSinDuplicados[], talles:Talle[], carrito:Carrito[], productos:Producto[], id_orden:any):OrdenDetalle[] => {

    let nuevoOrdenes:OrdenDetalle[] = [];


    for( let e of talles){

        for( let n of productosSinRepetir){

            if(e.id_producto == n.id_producto){

                if(e.talle == n.talle){

                    let dato_producto = productos.find( e => e.id == n.id_producto);
                    let dato_carrito = carrito.find( e => e.id_producto == n.id_producto && (e.talle == n.talle || e.talle == null));

                    let orden:any = {
                        id_orden,
                        id_producto:n.id_producto, 
                        nombre_producto:dato_producto!.nombre,
                        talle: n.talle, 
                        cantidad: n.cantidad,
                        precio: dato_carrito?.precio_nuevo == null ?  dato_producto?.precio :  dato_carrito?.precio_nuevo 
                    }

                    nuevoOrdenes.push(orden);

                }
            }
        }
    }

  //await OrdenDetalle.bulkCreate(nuevoOrdenes);
return nuevoOrdenes;
  
}




export const creandoOrdenDetallePorTotal = async () => {
 
     
}

export const verifcarSiTienenStock = (talles:Talle[], carrito:ProductoSinDuplicados[], productos:Producto[]) => {
  let productos_sin_stock:any = [];

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

return productos_sin_stock;
}