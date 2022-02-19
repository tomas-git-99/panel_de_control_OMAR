



//importar el modelo de /ventas/carrito
import {Carrito} from '../models/ventas/carrito';
import {Talle} from '../models/ventas/talles';
import { Producto } from "../models/ventas/producto";

// crear una funcion llamada sumaTotalID que reciba el id:number | string y precio, devuelva el any
export async function sumaDelMismoAritulo (id:number | string,id_prooducto:number | string, precio:number): Promise<any>{
    
    try {
            //crear una variable llamada carrito
    // en la variable carrito llamos el modelo Carrito, y buscamos todos los parecedidos con el id, en id_usuario
    let carrito = await Carrito.findAll({where:{id_usuario:id}});

    //creamos un array llamado carritoTotal, que se igual a carrito
    //donde vamos a guardar todos los carrito que son iguales con el id_prooducto
    let carritoTotal = carrito.filter(carrito => carrito.id_producto == id_prooducto);

    //recorremos el array carritoTotal
    //y update el precio de cada uno de los productos, con el nuevo precio
    carritoTotal.forEach(async (carrito) => {
        await carrito.update({precio_nuevo:precio});
    }
    )

    //retornamos que todo salio en la funcion 
    return {
        ok:true,
        message:"Todo salio bien"
    }
    } catch (error) {
        //si hay un error retornamos el error
        return {
            ok:false,
            message:error
        }
    }

}


// crear una funcion llamada descontarDeproducto que reciba el id_orden, id_usuario y que se una promesa
export async function descontarDelCarrito (id_orden:number | string, id_usuario:number | string): Promise<any>{

    // creamos una variable llamada carrito
    // donde va buscar con un await en Carrito, el id_usuario con el id_usuario
    let carrito = await Carrito.findAll({where:{id_usuario:id_usuario}});

    // solo creamos una array llamado IDTotalProductos 
    // donde vamos a guardar todos los id_producto de los carrito
    let IDTotalProductos = carrito.map(carrito => carrito.id_producto);

    // creamos una variable llamada productos
    // donde va buscar con un await en Producto, el IDTotalProductos
    let productos = await Producto.findAll({where:{id:IDTotalProductos}});

    //creamos un array llamado productosConTalles donde vamos aguardar numeros 
    //guardar el ID del productos
    //recorremos el array productos y verificar si la cantidad es null, guardar en productosConTalles
    let productosConTalles:any = productos.map(producto => {
        if(producto.cantidad == null){
            return producto.id
        }
    }
    )

    //creamos un array llamado talles
    //donde vamos a buscar await en Talle, con productosConTalles

    let talles = await Talle.findAll({where:{id_producto:productosConTalles}});
}                            






   

