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
exports.verifcarSiTienenStock = exports.creandoOrdenDetallePorTotal = exports.creandoOrdenDetallePorTalle = exports.sumaDeTodoLosProductos = exports.juntarTodosLosTallesEnUno = exports.armarLasCurvas = void 0;
const armarLasCurvas = (carrito, talles) => {
    /* try { */
    let nuevosCurvas = [];
    carrito.map(e => {
        if (e.talle == null && talles.some(h => h.id_producto == e.id_producto)) {
            let totalTalle = talles.filter(h => h.id_producto == e.id_producto).map(p => p.talle);
            totalTalle.map(talle => {
                nuevosCurvas = [...nuevosCurvas, { id_producto: e.id_producto, talle: talle, cantidad: e.cantidad }];
            });
        }
        else {
            nuevosCurvas = [...nuevosCurvas, { id_producto: e.id_producto, talle: e.talle, cantidad: e.cantidad }];
        }
    });
    return nuevosCurvas;
    /*   } catch (error) {
    
      } */
};
exports.armarLasCurvas = armarLasCurvas;
const juntarTodosLosTallesEnUno = (ids_productos, carrito) => {
    let idsTalle = [];
    ids_productos.map(e => {
        carrito.map((carritos) => {
            if (e == carritos.id_producto && carritos.talle !== null) {
                if (idsTalle.some(p => p.id_producto == e) == true) {
                    if (idsTalle.find(l => l.id_producto == e).talles.every((o) => o !== carritos.talle) == true) {
                        idsTalle.find((h) => h.id_producto == e)["talles"].push(carritos.talle);
                    }
                }
                else {
                    idsTalle.push({ id_producto: e, talles: [carritos.talle] });
                }
            }
        });
    });
    return idsTalle;
};
exports.juntarTodosLosTallesEnUno = juntarTodosLosTallesEnUno;
const sumaDeTodoLosProductos = (idsTalles, carrito) => {
    let listaDeProductosSinRepetir = [];
    for (let id of idsTalles) {
        let id_producto_seleccionado = idsTalles.filter((g) => g.id_producto == id.id_producto).map((t) => t.talles);
        id_producto_seleccionado[0].map((f) => {
            let nuevaCantidada = carrito
                .filter(r => r.id_producto == id.id_producto && f == r.talle);
            let cantidad = 0;
            for (let ca of nuevaCantidada) {
                cantidad += ca.cantidad;
            }
            listaDeProductosSinRepetir.push({ id_producto: id.id_producto, talle: f, cantidad: cantidad });
        });
    }
    return listaDeProductosSinRepetir;
};
exports.sumaDeTodoLosProductos = sumaDeTodoLosProductos;
/* function sumarTodo ( uno:any, dos:any ){
  return uno + dos
} */
const creandoOrdenDetallePorTalle = (productosSinRepetir, talles, carrito, productos, id_orden) => {
    let nuevoOrdenes = [];
    for (let e of talles) {
        for (let n of productosSinRepetir) {
            if (e.id_producto == n.id_producto) {
                if (e.talle == n.talle) {
                    let dato_producto = productos.find(e => e.id == n.id_producto);
                    let dato_carrito = carrito.find(e => e.id_producto == n.id_producto && (e.talle == n.talle || e.talle == null));
                    let orden = {
                        id_orden,
                        id_producto: n.id_producto,
                        nombre_producto: dato_producto.nombre,
                        talle: n.talle,
                        cantidad: n.cantidad,
                        precio: (dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo) == null ? dato_producto === null || dato_producto === void 0 ? void 0 : dato_producto.precio : dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo
                    };
                    nuevoOrdenes.push(orden);
                }
            }
        }
    }
    //await OrdenDetalle.bulkCreate(nuevoOrdenes);
    return nuevoOrdenes;
};
exports.creandoOrdenDetallePorTalle = creandoOrdenDetallePorTalle;
const creandoOrdenDetallePorTotal = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.creandoOrdenDetallePorTotal = creandoOrdenDetallePorTotal;
const verifcarSiTienenStock = (talles, carrito, productos) => {
    let productos_sin_stock = [];
    talles.map(e => {
        carrito.map(p => {
            if (p.id_producto == e.id_producto) {
                if (p.talle == e.talle) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        let dato_producto = productos.find(e => e.id == p.id_producto);
                        productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                    }
                }
                else if (p.talle == null) {
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        let dato_producto = productos.find(e => e.id == p.id_producto);
                        productos_sin_stock.push(`El producto: "${dato_producto.nombre} y talle: ${e.talle}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                    }
                }
            }
        });
    });
    return productos_sin_stock;
};
exports.verifcarSiTienenStock = verifcarSiTienenStock;
//# sourceMappingURL=descontar_carrito_func.js.map