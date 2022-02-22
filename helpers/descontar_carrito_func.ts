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



export const juntarTodosLosTallesEnUno = async (ids_productos:[], carrito:Carrito[]): Promise<any> => {

let idsTalle:Productos[] = []


ids_productos.map( e => {

    carrito.map((carritos) => {
  
      if( e == carritos.id_producto){
  
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
          
          carrito
          .filter( r => r.id_producto == id.id_producto && f == r.talle)
          .reduce( (pre:any, des:any) => {

            listaDeProductosSinRepetir.push({id_producto:id.id_producto,  talle:f, cantidad:pre.cantidad + des.cantidad})
            
          })
     
        })
        }
    return listaDeProductosSinRepetir;
}




export const creandoOrdenDetalle = async( productosSinRepetir:ProductoSinDuplicados[], talles:Talle[], carrito:Carrito[], productos:Producto[], id_orden:number) => {

    let nuevoOrdenes:OrdenDetalle[] = [];


    for( let e of talles){

        for( let n of productosSinRepetir){

            if(e.id_producto == n.id_producto){

                if(e.talle == n.talle){

                    let dato_producto = productos.find( e => e.id == n.id_producto);
                    let dato_carrito = carrito.find( e => e.id_producto == n.id_producto && e.talle == n.talle);

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
  
}