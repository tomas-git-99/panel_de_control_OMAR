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
exports.crearOrdenDetalleTotal = exports.unirPortalleParaOrdenDetallada = exports.verificarSiHayStockTotal = exports.repeticionDeProductos = exports.unirCurvasOUnidadTotal = exports.verifcarSiTienenStock = exports.creandoOrdenDetallePorTotal = exports.creandoOrdenDetallePorTalle = exports.sumaDeTodoLosProductos = exports.juntarTodosLosTallesEnUno = exports.armarLasCurvas = void 0;
const orden_detalle_1 = require("../models/ventas/orden_detalle");
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
const creandoOrdenDetallePorTalle = (productosSinRepetir, talles, carrito, productos, id_orden) => __awaiter(void 0, void 0, void 0, function* () {
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
                        precio: (dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo) == null ? dato_producto === null || dato_producto === void 0 ? void 0 : dato_producto.precio : dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo,
                        nota: dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.nota,
                    };
                    nuevoOrdenes.push(orden);
                }
            }
        }
    }
    yield orden_detalle_1.OrdenDetalle.bulkCreate(nuevoOrdenes);
    return nuevoOrdenes;
});
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
///////////////////////////////////////////////PRODUCTOS QUE SOLO TIENE EL TOTAL////////////////////////////////////////////////
//con esta funcion separamos las curvas por separado
const unirCurvasOUnidadTotal = (ids_productos_unidad, carrito, productos) => {
    var _a;
    try {
        let productosTotal = carrito.filter(e => ids_productos_unidad.includes(e.id_producto));
        let productosCurvasUnidad = [];
        for (let e of productosTotal) {
            if (e.talle === null) {
                let talleTotal = (_a = productos.find(h => h.id == e.id_producto)) === null || _a === void 0 ? void 0 : _a.talles.split(",");
                for (let talles of talleTotal) {
                    productosCurvasUnidad.push({ id_producto: e.id_producto, cantidad: e.cantidad, talle: parseInt(talles) });
                }
            }
            else {
                productosCurvasUnidad.push({ id_producto: e.id_producto, cantidad: e.cantidad, talle: e.talle });
            }
        }
        return productosCurvasUnidad;
    }
    catch (error) {
        return [{
                error: "Error al unir productos con las curvas, function 'unirCurvasOUnidadTotal'",
                mesanje: error
            }];
    }
};
exports.unirCurvasOUnidadTotal = unirCurvasOUnidadTotal;
//verificas si el producto se repite, y si es asi lo unimos solo en un array
const repeticionDeProductos = (productosCurvas) => {
    try {
        //let productosTotal = carrito.filter( e => ids_productos_unidad.includes(e.id_producto));
        let productosSinRepetir = productosCurvas.reduce((acumulador, valorActual) => {
            const elementoYaExiste = acumulador.find((elemento) => elemento.id_producto === valorActual.id_producto && elemento.talle !== null);
            if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                    if (elemento.id_producto === valorActual.id_producto && elemento.talle !== null) {
                        return Object.assign(Object.assign({}, elemento), { cantidad: elemento.cantidad + valorActual.cantidad });
                    }
                    return elemento;
                });
            }
            return [...acumulador, valorActual];
        }, []);
        return productosSinRepetir;
    }
    catch (error) {
        return {
            error: "Error al verificar si se repite el producto, function 'repeticionDeProductos'",
            mensaje: error
        };
    }
};
exports.repeticionDeProductos = repeticionDeProductos;
//ya verificado que los productos no se repiten, ahora verificamos si tiene stock
const verificarSiHayStockTotal = (productosSinRepetir, productos) => {
    try {
        let productos_sin_stock = [];
        productos.map(e => {
            productosSinRepetir.map((p) => {
                if (e.id == p.id_producto) {
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
                    if (e.cantidad < p.cantidad || e.cantidad == 0) {
                        productos_sin_stock.push(`El producto "${e.nombre}" con stock de actual: ${e.cantidad}, cantidad de tu carrito: ${p.cantidad} `);
                    }
                    /*  } */
                }
            });
        });
        return productos_sin_stock;
    }
    catch (error) {
        return {
            error: "Error al verificar si hay stock, function 'verificarSiHayStock'",
            mensaje: error
        };
    }
};
exports.verificarSiHayStockTotal = verificarSiHayStockTotal;
//unimos los productos que fueron mandados separados de la curva, para crear un ordenDetalle
const unirPortalleParaOrdenDetallada = (produstosSeparados, ids_productos_total, productos, carrito) => {
    var _a;
    try {
        let nuevaProductos = [];
        for (let p of ids_productos_total) {
            let todosLosProductos = produstosSeparados.filter(e => e.id_producto == p);
            let cantidad = 0;
            if (todosLosProductos.length > 1) {
                let tallesTotal = (_a = productos.find(h => h.id == p)) === null || _a === void 0 ? void 0 : _a.talles.split(",");
                for (let talles of tallesTotal) {
                    if (produstosSeparados.some(f => f.talle == parseInt(talles) && f.id_producto == p)) {
                        todosLosProductos.filter(g => g.talle == parseInt(talles)).map(r => cantidad += r.cantidad);
                        nuevaProductos.push({ id_producto: p, cantidad: cantidad, talle: parseInt(talles) });
                        cantidad = 0;
                    }
                }
            }
            else {
                nuevaProductos.push({ id_producto: p, cantidad: cantidad, talle: todosLosProductos[0].talle });
                cantidad = 0;
            }
        }
        return nuevaProductos;
    }
    catch (error) {
        return [{
                error: "Error al unir productos para hacer las ordenes, function 'unirPortalleParaOrdenDetallada'",
                mensaje: error
            }];
    }
};
exports.unirPortalleParaOrdenDetallada = unirPortalleParaOrdenDetallada;
//creamos el ordenDetalle
const crearOrdenDetalleTotal = (id_orden, productosSinRepetir, productos, carrito) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let nuevoOrdenes = [];
        for (let n of productosSinRepetir) {
            let dato_producto = productos.find(e => e.id == n.id_producto);
            let dato_carrito = carrito.find(e => e.id_producto == n.id_producto && (e.talle == n.talle || e.talle == null));
            let orden = {
                id_orden,
                id_producto: n.id_producto,
                nombre_producto: dato_producto.nombre,
                talle: n.talle,
                cantidad: n.cantidad,
                precio: (dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo) == null ? dato_producto === null || dato_producto === void 0 ? void 0 : dato_producto.precio : dato_carrito === null || dato_carrito === void 0 ? void 0 : dato_carrito.precio_nuevo,
                nota: dato_carrito.nota,
            };
            nuevoOrdenes.push(orden);
        }
        yield orden_detalle_1.OrdenDetalle.bulkCreate(nuevoOrdenes);
        return nuevoOrdenes;
    }
    catch (error) {
        return [{
                error: "Error al crear orden detalle, function 'crearOrdenDetalleTotal'",
                mensaje: error
            }];
    }
});
exports.crearOrdenDetalleTotal = crearOrdenDetalleTotal;
//# sourceMappingURL=descontar_carrito_func.js.map