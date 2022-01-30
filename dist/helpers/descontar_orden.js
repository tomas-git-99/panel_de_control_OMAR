"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descontarCurvaTalle_talleManda = exports.descontarCurvaTalle = exports.descontarCurvas = void 0;
//CURVAS PARA PRODUCTOS QUE NO TIENE TALLES
const descontarCurvas = (cantidad, cantidad_antigua, ordenDetalle, orden, producto) => {
    let cantidadDescontarOsumar;
    let cantidadTotalProducto;
    let cantidadTotalOrden;
    let largoDeTalle = producto.talles.split(',').length;
    let stockProducto;
    let data;
    if (cantidad_antigua > cantidad) {
        cantidadDescontarOsumar = (cantidad_antigua - cantidad) * largoDeTalle;
        cantidadTotalProducto = largoDeTalle * cantidad;
        let descontarOrden = orden.total - (ordenDetalle.cantidad * ordenDetalle.precio);
        cantidadTotalOrden = descontarOrden + (ordenDetalle.precio * cantidadTotalProducto);
        if (ordenDetalle.talle.split(',').length == 1) {
            stockProducto = producto.cantidad - (cantidadTotalProducto - ordenDetalle.cantidad);
            if (producto.cantidad < (cantidadTotalProducto - ordenDetalle.cantidad) || producto.cantidad == 0) {
                return data = {
                    err: `El producto: "${producto.nombre}" con stock de actual: ${producto.cantidad}, cantidad que quieres colocar: ${(cantidadTotalProducto - ordenDetalle.cantidad)} `
                };
            }
        }
        else {
            stockProducto = producto.cantidad + cantidadDescontarOsumar;
        }
        return data = {
            cantidadTotalDetalle: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
            productoStock: stockProducto
        };
    }
    else {
        cantidadDescontarOsumar = (cantidad - cantidad_antigua) * largoDeTalle;
        cantidadTotalProducto = largoDeTalle * cantidad;
        if (producto.cantidad < cantidadDescontarOsumar || producto.cantidad == 0) {
            return data = {
                err: `El producto: "${producto.nombre}" con stock de actual: ${producto.cantidad}, cantidad que quieres colocar: ${cantidadDescontarOsumar} `
            };
        }
        let descontarOrden = orden.total - (ordenDetalle.cantidad * ordenDetalle.precio);
        cantidadTotalOrden = descontarOrden + (ordenDetalle.precio * cantidadTotalProducto);
        if (ordenDetalle.talle.split(',').length == 1) {
            stockProducto = producto.cantidad - (cantidadTotalProducto - ordenDetalle.cantidad);
        }
        else {
            stockProducto = producto.cantidad - cantidadDescontarOsumar;
        }
        return data = {
            cantidadTotalDetalle: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
            productoStock: stockProducto
        };
    }
};
exports.descontarCurvas = descontarCurvas;
//CURVAS QUE TIENEN TALLES POR SEPARADO
const descontarCurvaTalle = (cantidad, talles, ordenDetalle, orden, producto) => {
    let largoDeTalle = talles.length;
    let talleEnProducto = ordenDetalle.talle.split(',').length;
    let tallesDescontar = [];
    let productos_sin_stock = [];
    let cantidaTotalDetalle;
    let cantidadTotalOrden;
    let data;
    if (talleEnProducto == 1) {
        for (let t of talles) {
            let nuevaCantidadTalle;
            if (parseInt(ordenDetalle.talle) == t.talle) {
                if (ordenDetalle.cantidad > cantidad) {
                    nuevaCantidadTalle = t.cantidad + (ordenDetalle.cantidad - cantidad);
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                }
                else {
                    nuevaCantidadTalle = t.cantidad + (cantidad - ordenDetalle.cantidad);
                    if (t.cantidad < (cantidad - ordenDetalle.cantidad) || t.cantidad == 0) {
                        productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${(cantidad - ordenDetalle.cantidad)} `);
                    }
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                }
            }
            else {
                if (t.cantidad < cantidad || t.cantidad == 0) {
                    productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, no tiene stock suficiente para hacer esta modificacion, cantidad que quieres descontar: ${cantidad} `);
                }
                nuevaCantidadTalle = t.cantidad - cantidad;
                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
            }
        }
        cantidaTotalDetalle = largoDeTalle * cantidad;
        cantidadTotalOrden = (ordenDetalle.precio * cantidaTotalDetalle) + (orden.total - (ordenDetalle.cantidad * ordenDetalle.precio));
        return data = {
            productosSinStock: productos_sin_stock,
            cantidadTotalDetalle: cantidaTotalDetalle,
            cantidadTotalOrden: cantidadTotalOrden,
            talleStock: tallesDescontar
        };
    }
    else if (talleEnProducto > 1) {
        let cantidadDescontarPorTalle = ordenDetalle.cantidad / largoDeTalle;
        let nuevaCantidadTalle;
        if (cantidadDescontarPorTalle > cantidad) {
            for (let t of talles) {
                nuevaCantidadTalle = t.cantidad + (cantidadDescontarPorTalle - cantidad);
                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
            }
        }
        else {
            for (let t of talles) {
                if (t.cantidad < (cantidad - cantidadDescontarPorTalle) || t.cantidad == 0) {
                    productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${(cantidad - cantidadDescontarPorTalle)} `);
                }
                nuevaCantidadTalle = t.cantidad - (cantidad - cantidadDescontarPorTalle);
                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
            }
        }
        cantidaTotalDetalle = largoDeTalle * cantidad;
        cantidadTotalOrden = (ordenDetalle.precio * cantidaTotalDetalle) + (orden.total - (ordenDetalle.cantidad * ordenDetalle.precio));
        return data = {
            productosSinStock: productos_sin_stock,
            cantidadTotalDetalle: cantidaTotalDetalle,
            cantidadTotalOrden: cantidadTotalOrden,
            talleStock: tallesDescontar
        };
    }
};
exports.descontarCurvaTalle = descontarCurvaTalle;
const descontarCurvaTalle_talleManda = (cantidad, talle, talles, ordenDetalle, orden, producto) => {
    let largoDeTalle = talles.length;
    let talleEnProducto = ordenDetalle.talle.split(',').length;
    let tallesDescontar = [];
    let tallesSumar = [];
    let productos_sin_stock = [];
    let cantidaTotalDetalle;
    let cantidadTotalOrden;
    let data;
    if (talleEnProducto == 1) {
        if (talle == parseInt(ordenDetalle.talle)) {
            let nuevaCantidad;
            if (ordenDetalle.cantidad > cantidad) {
                nuevaCantidad = ordenDetalle.cantidad - cantidad;
            }
            else {
                nuevaCantidad = cantidad - ordenDetalle.cantidad;
            }
        }
        else {
            let nuevaCantidad;
            for (let t of talles) {
                if (t.talle == talle) {
                    if (t.cantidad < cantidad || t.cantidad == 0) {
                        productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad} `);
                    }
                    nuevaCantidad = t.cantidad - cantidad;
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidad }];
                }
                else if (t.talle == parseInt(ordenDetalle.talle)) {
                    nuevaCantidad = t.cantidad + ordenDetalle.cantidad;
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidad }];
                }
            }
        }
        return data = {
            productosSinStock: productos_sin_stock,
            tallesDescontar: tallesDescontar,
        };
    }
    else if (talleEnProducto > 1) {
        talles.find(t => {
            if (t.talle == talle) {
                if (t.cantidad < cantidad || t.cantidad == 0) {
                    productos_sin_stock.push(`El producto: "${producto.nombre} y talle: ${t.talle}" con stock de actual: ${t.cantidad}, cantidad que quieres colocar: ${cantidad} `);
                }
            }
        });
        for (let t of talles) {
            let nuevaCantidad;
            if (t.talle == talle) {
                if (ordenDetalle.cantidad > cantidad) {
                    nuevaCantidad = (ordenDetalle.cantidad / largoDeTalle) - cantidad;
                    let nuevaCantidadTalle = t.cantidad - nuevaCantidad;
                    console.log(nuevaCantidad);
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidadTalle }];
                }
                else {
                    nuevaCantidad = cantidad - (ordenDetalle.cantidad / largoDeTalle);
                    tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidad }];
                }
            }
            else {
                nuevaCantidad = t.cantidad + (ordenDetalle.cantidad / largoDeTalle);
                tallesDescontar = [...tallesDescontar, { talle: t.talle, cantidad: nuevaCantidad }];
            }
        }
        return data = {
            productosSinStock: productos_sin_stock,
            tallesDescontar: tallesDescontar,
        };
    }
};
exports.descontarCurvaTalle_talleManda = descontarCurvaTalle_talleManda;
//# sourceMappingURL=descontar_orden.js.map