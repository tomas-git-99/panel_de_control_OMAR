"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descontarCurvas = void 0;
//CURVAS PARA PRODUCTOS QUE NO TIENE TALLES
const descontarCurvas = (cantidad, cantidad_antigua, ordenDetalle, orden, producto) => {
    let cantidadDescontarOsumar;
    let cantidadTotalProducto;
    let cantidadTotalOrden;
    let largoDeTalle = ordenDetalle.talle.split(',').length;
    let data;
    if (cantidad_antigua > cantidad) {
        cantidadDescontarOsumar = cantidad_antigua - cantidad;
        cantidadTotalProducto = largoDeTalle * cantidad;
        let descontarOrden = orden.total - (ordenDetalle.cantidad * ordenDetalle.precio);
        cantidadTotalOrden = descontarOrden + (ordenDetalle.precio * cantidadTotalProducto);
        return data = {
            cantidadTotal: cantidadTotalProducto,
            cantidadTotalOrden: cantidadTotalOrden,
        };
    }
};
exports.descontarCurvas = descontarCurvas;
//# sourceMappingURL=descontar_orden.js.map