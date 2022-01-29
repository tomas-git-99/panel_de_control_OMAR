
//CURVAS PARA PRODUCTOS QUE NO TIENE TALLES
export const descontarCurvas = (cantidad:any, cantidad_antigua:any, ordenDetalle:any, orden:any, producto:any) =>{

    let cantidadDescontarOsumar

    let cantidadTotalProducto 

    let cantidadTotalOrden

    let largoDeTalle = ordenDetalle.talle.split(',').length;

    let data


    if(cantidad_antigua > cantidad){

        cantidadDescontarOsumar = cantidad_antigua - cantidad;

        cantidadTotalProducto   = largoDeTalle * cantidad;

        let descontarOrden = orden!.total - (ordenDetalle!.cantidad * ordenDetalle!.precio);
        cantidadTotalOrden = descontarOrden + (ordenDetalle!.precio *cantidadTotalProducto);

        return data = { 
            cantidadTotal: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
        }
    }



}