"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.descontarDelCarrito = exports.sumaDelMismoAritulo = void 0;
//importar el modelo de /ventas/carrito
const carrito_1 = require("../models/ventas/carrito");
const producto_1 = require("../models/ventas/producto");
// crear una funcion llamada sumaTotalID que reciba el id:number | string y precio, devuelva el any
function sumaDelMismoAritulo(id, id_prooducto, precio) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //crear una variable llamada carrito
            // en la variable carrito llamos el modelo Carrito, y buscamos todos los parecedidos con el id, en id_usuario
            let carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id } });
            //creamos un array llamado carritoTotal, que se igual a carrito
            //donde vamos a guardar todos los carrito que son iguales con el id_prooducto
            let carritoTotal = carrito.filter(carrito => carrito.id_producto == id_prooducto);
            //recorremos el array carritoTotal
            //y update el precio de cada uno de los productos, con el nuevo precio
            carritoTotal.forEach((carrito) => __awaiter(this, void 0, void 0, function* () {
                yield carrito.update({ precio_nuevo: precio });
            }));
            //retornamos que todo salio en la funcion 
            return {
                ok: true,
                message: "Todo salio bien"
            };
        }
        catch (error) {
            //si hay un error retornamos el error
            return {
                ok: false,
                message: error
            };
        }
    });
}
exports.sumaDelMismoAritulo = sumaDelMismoAritulo;
// crear una funcion llamada descontarDeproducto que reciba el id_orden, id_usuario y que se una promesa
function descontarDelCarrito(id_orden, id_usuario) {
    return __awaiter(this, void 0, void 0, function* () {
        // creamos una variable llamada carrito
        // donde va buscar con un await en Carrito, el id_usuario con el id_usuario
        let carrito = yield carrito_1.Carrito.findAll({ where: { id_usuario: id_usuario } });
        // solo creamos una array llamado IDTotalProductos 
        // donde vamos a guardar todos los id_producto de los carrito
        let IDTotalProductos = carrito.map(carrito => carrito.id_producto);
        // creamos una variable llamada productos
        // donde va buscar con un await en Producto, el IDTotalProductos
        let productos = yield producto_1.Producto.findAll({ where: { id: IDTotalProductos } });
        //creamos un array llamado productosConTalles donde vamos aguardar numeros 
        //guardar el ID del productos
        //recorremos el array productos y verificar si la cantidad es null, guardar en productosConTalles
        let productosConTalles = productos.map(producto => {
            if (producto.cantidad == null) {
                return producto.id;
            }
        });
        const miCarritoSinDuplicados = carrito.reduce((acumulador, valorActual) => {
            const elementoYaExiste = acumulador.find((elemento) => elemento.id_producto === valorActual.id_producto);
            if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                    if (elemento.id_producto === valorActual.id_producto) {
                        return Object.assign(Object.assign({}, elemento), { cantidad: elemento.cantidad + valorActual.cantidad });
                    }
                    return elemento;
                });
            }
            return [...acumulador, valorActual];
        }, []);
    });
}
exports.descontarDelCarrito = descontarDelCarrito;
//# sourceMappingURL=descontar_carrito.js.map