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
    talle      :number | null,
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
export const creandoOrdenDetallePorTalle = async( productosSinRepetir:ProductoSinDuplicados[], talles:Talle[], carrito:Carrito[], productos:Producto[], id_orden:any):Promise<OrdenDetalle[]> => {

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

  await OrdenDetalle.bulkCreate(nuevoOrdenes);
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




///////////////////////////////////////////////PRODUCTOS QUE SOLO TIENE EL TOTAL////////////////////////////////////////////////



//con esta funcion separamos las curvas por separado
export const unirCurvasOUnidadTotal = (ids_productos_unidad:number[], carrito:Carrito[], productos:Producto[]): ProductoSinDuplicados[] | any[]  => {

  try {

    let productosTotal = carrito.filter( e => ids_productos_unidad.includes(e.id_producto));

    let productosCurvasUnidad:ProductoSinDuplicados[] = []

    
    for(let e of productosTotal){

      if(e.talle === null){

        let talleTotal:any = productos.find( h => h.id == e.id_producto)?.talles.split(",");

     

        for( let talles of talleTotal){

          productosCurvasUnidad.push({id_producto:e.id_producto, cantidad:e.cantidad , talle:parseInt(talles)});

        }


      }else{

        productosCurvasUnidad.push({id_producto:e.id_producto, cantidad:e.cantidad , talle:e.talle});
      }
    }

    return productosCurvasUnidad;
    
  } catch (error) {
    return [{
      error:"Error al unir productos con las curvas, function 'unirCurvasOUnidadTotal'",
      mesanje:error
    }]
  }

}


//verificas si el producto se repite, y si es asi lo unimos solo en un array

export const repeticionDeProductos = (productosCurvas:ProductoSinDuplicados[])  => {

  try {
    
  //let productosTotal = carrito.filter( e => ids_productos_unidad.includes(e.id_producto));

  let productosSinRepetir = productosCurvas.reduce((acumulador:any, valorActual:any) => {

    const elementoYaExiste = acumulador.find((elemento:any) => elemento.id_producto === valorActual.id_producto && elemento.talle !== null);
    if (elementoYaExiste) {
       
      return acumulador.map((elemento:any) => {
        if (elemento.id_producto === valorActual.id_producto && elemento.talle !== null) {
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

  return productosSinRepetir;

  } catch (error) {
    return {
      error:"Error al verificar si se repite el producto, function 'repeticionDeProductos'",
      mensaje:error
    }
  }


}

//ya verificado que los productos no se repiten, ahora verificamos si tiene stock
export const verificarSiHayStockTotal = (productosSinRepetir:any[], productos:Producto[]) => {

  try {

  let productos_sin_stock:any = [];

    productos.map( e => {

      productosSinRepetir.map( (p:any) => {
          if(e.id == p.id_producto){

/*               if(p.talle == null){

                  let cantidadDeTalle:any = e.talles.split(",");
                  let contador = 0;

                  for(let count of cantidadDeTalle){
                      contador += p.cantidad;
                  }

                  
                  if(e.cantidad < contador || e.cantidad == 0){
                      productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito(curva): ${contador} ` );
                  }

                 

              }else{ */
                 
                  if(e.cantidad < p.cantidad || e.cantidad == 0){
                      productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} ` );
                  }
             /*  } */


          }
      })


  });


  return productos_sin_stock;
  
  } catch (error) {
    return { 
      error: "Error al verificar si hay stock, function 'verificarSiHayStock'",
      mensaje: error
    }
  }
}




//unimos los productos que fueron mandados separados de la curva, para crear un ordenDetalle
export const unirPortalleParaOrdenDetallada = (produstosSeparados:ProductoSinDuplicados[], ids_productos_total:number[], productos:Producto[], carrito:Carrito[]):ProductoSinDuplicados[] | any[] => {

  try {

    let nuevaProductos:ProductoSinDuplicados[] = [];

    for(let p of ids_productos_total){

      let todosLosProductos = produstosSeparados.filter( e => e.id_producto == p);
     

      let cantidad = 0;


      if( todosLosProductos.length > 1){

        

        let tallesTotal = productos.find( h => h.id == p)?.talles.split(",");

        for( let talles of tallesTotal!){

          if(produstosSeparados.some(f => f.talle == parseInt(talles) && f.id_producto == p)){

            todosLosProductos.filter( g => g.talle == parseInt(talles)).map( r => cantidad += r.cantidad);

            nuevaProductos.push({id_producto:p, cantidad:cantidad, talle:parseInt(talles)});
            cantidad = 0;
          }
          
        }
      }else{
        nuevaProductos.push({id_producto:p, cantidad:cantidad, talle:todosLosProductos[0].talle});
        cantidad = 0;

      }

     
  

    }


    return nuevaProductos;

  } catch (error) {
    return [{
      error:"Error al unir productos para hacer las ordenes, function 'unirPortalleParaOrdenDetallada'",
      mensaje:error
    }]
  }
}


//creamos el ordenDetalle
export const crearOrdenDetalleTotal =  async (id_orden:number, productosSinRepetir:any[], productos:Producto[], carrito:Carrito[]):Promise<any[]>  => {

  try {
    
    let nuevoOrdenes:any[] = [];

    for(let n of productosSinRepetir){

        let dato_producto:any = productos.find( e => e.id == n.id_producto);

        let dato_carrito:any = carrito.find( e => e.id_producto == n.id_producto && (e.talle == n.talle || e.talle == null));

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



    await OrdenDetalle.bulkCreate(nuevoOrdenes);

    return nuevoOrdenes;

  } catch (error) {
    return [{
      error:"Error al crear orden detalle, function 'crearOrdenDetalleTotal'",
      mensaje:error
  }]
}

}