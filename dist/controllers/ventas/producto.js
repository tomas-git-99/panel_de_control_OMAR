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
exports.buscarProductosDoble = exports.cambiarProductosDeLocal = exports.buscarLocal = exports.soloLocales = exports.obtenerUnoProducto = exports.hitorialProductos = exports.quitarStock = exports.agregarMasStock = exports.eliminarProducto = exports.buscarProducto = exports.editarProducto = exports.crearProducto = void 0;
const dist_1 = require("sequelize/dist");
const producto_1 = require("../../models/ventas/producto");
const talles_1 = require("../../models/ventas/talles");
const usuario_1 = require("../../models/ventas/usuario");
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = new producto_1.Producto(req.body);
        yield producto.save();
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.crearProducto = crearProducto;
const editarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const producto = yield producto_1.Producto.findByPk(id);
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: id } });
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: `El usuario con el id ${id} no existe`
            });
        }
        let nombre = Object.keys(body);
        if (req.query.vaciar == "true") {
            yield producto.update({ cantidad: null });
            return res.json({
                ok: true,
                producto
            });
        }
        if (nombre[0] == "cantidad") {
            if (talles.length > 0) {
                return res.json({
                    ok: false,
                    msg: "Este producto ya esta separado por talle, si solo quieres usar el total tienes que ELIMINAR los talles de este producto"
                });
            }
        }
        yield producto.update(body);
        res.json({
            ok: true,
            producto
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.editarProducto = editarProducto;
const buscarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let valor = req.query.offset;
    let valorOffset = parseInt(valor);
    let valorID = req.query.usuario;
    let valorBusqueda = "";
    if (valorID !== undefined) {
        const usuario = yield usuario_1.Usuario.findByPk(parseInt(valorID));
        if ((usuario === null || usuario === void 0 ? void 0 : usuario.local) == null) {
            if ((usuario === null || usuario === void 0 ? void 0 : usuario.rol) == "ADMIN") {
                valorBusqueda = "";
            }
        }
        else if (usuario.venta == "ONLINE") {
            if (usuario.local)
                valorBusqueda = usuario.local;
            valorBusqueda = "";
        }
        else {
            valorBusqueda = usuario.local;
        }
    }
    /*     let sinEspacio:any = req.query.nombre;
    
        console.log(sinEspacio.replace(/ /g, "")); */
    const productos_rows = yield producto_1.Producto.findAndCountAll({ where: {
            estado: true,
            local: { [dist_1.Op.like]: '%' + valorBusqueda + '%' },
            [dist_1.Op.or]: [
                {
                    nombre: { [dist_1.Op.like]: '%' + req.query.nombre + '%' }
                },
                {
                    id: { [dist_1.Op.like]: '%' + req.query.nombre + '%' }
                }
            ]
        }, limit: 10, offset: valorOffset });
    /*   const productos_rows = await Producto.findAndCountAll({ where:{
          estado:true,
          nombre:{ [Op.like]: '%'+ req.query.nombre +'%'},
          id:{ [Op.like]: '%'+ req.query.nombre +'%'}
          
      }, limit:10, offset:valorOffset} );
     */
    let contador = productos_rows.count;
    let ids_productos = [];
    productos_rows.rows.map(e => {
        ids_productos.push(e.id);
    });
    const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos } });
    let productos = [];
    productos_rows.rows.forEach(e => {
        let tallesNew = talles.filter(i => { var _a; return (_a = i.id_producto == e.id) !== null && _a !== void 0 ? _a : i; });
        productos = [...productos, { productos: e, talles: tallesNew }];
    });
    res.json({
        ok: true,
        contador,
        productos
    });
});
exports.buscarProducto = buscarProducto;
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield producto_1.Producto.findByPk(id);
        yield (producto === null || producto === void 0 ? void 0 : producto.update({ estado: false }));
        res.json({
            ok: true
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.eliminarProducto = eliminarProducto;
const agregarMasStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { agregar } = req.body;
    const producto = yield producto_1.Producto.findByPk(id);
    const nuevoStock = agregar + (producto === null || producto === void 0 ? void 0 : producto.cantidad);
    yield (producto === null || producto === void 0 ? void 0 : producto.update({ cantidad: nuevoStock }));
    res.json({
        ok: true,
        producto
    });
});
exports.agregarMasStock = agregarMasStock;
const quitarStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quitar } = req.body;
    const producto = yield producto_1.Producto.findByPk(id);
    const nuevoStock = producto.cantidad - quitar;
    yield (producto === null || producto === void 0 ? void 0 : producto.update({ cantidad: nuevoStock }));
    res.json({
        ok: true,
        producto
    });
});
exports.quitarStock = quitarStock;
const hitorialProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let valor = req.query.offset;
        let valorOffset = parseInt(valor);
        let valorID = req.query.usuario;
        let valorBusqueda = "";
        if (valorID !== undefined) {
            const usuario = yield usuario_1.Usuario.findByPk(parseInt(valorID));
            if ((usuario === null || usuario === void 0 ? void 0 : usuario.local) == null) {
                if ((usuario === null || usuario === void 0 ? void 0 : usuario.rol) == "ADMIN") {
                    valorBusqueda = "";
                }
            }
            else if (usuario.venta == "ONLINE") {
                if (usuario.local)
                    valorBusqueda = usuario.local;
                valorBusqueda = "";
            }
            else {
                valorBusqueda = usuario.local;
            }
        }
        const productos_rows = yield producto_1.Producto.findAndCountAll({ where: { estado: true, local: { [dist_1.Op.like]: '%' + valorBusqueda + '%' } }, order: [['createdAt', 'DESC']], limit: 10, offset: valorOffset });
        let ids_productos = [];
        productos_rows.rows.map(e => {
            ids_productos.push(e.id);
        });
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos } });
        let productos = [];
        const contador = productos_rows.count;
        productos_rows.rows.map(e => {
            let tallesNew = talles.filter(i => { var _a; return (_a = i.id_producto == e.id) !== null && _a !== void 0 ? _a : i; });
            productos = [...productos, { productos: e, talles: tallesNew || '' }];
        });
        res.json({
            ok: true,
            contador,
            productos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.hitorialProductos = hitorialProductos;
const obtenerUnoProducto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield producto_1.Producto.findByPk(id);
        const talles = yield talles_1.Talle.findAll({ where: { id_producto: id }, order: [['talle', 'ASC']] });
        if (!talles) {
            return res.json({
                ok: false,
                msg: "Estas talles con existen"
            });
        }
        return res.json({
            ok: true,
            producto,
            talles
        });
    }
    catch (error) {
        return res.status(505).json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerUnoProducto = obtenerUnoProducto;
const soloLocales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locales = yield producto_1.Producto.findAll({ where: { estado: true }, attributes: ['local'] });
    const result = [];
    locales.forEach((item) => {
        //pushes only unique element
        let local = item.local.toUpperCase();
        if (!result.includes(local)) {
            if (local.length > 0) {
                result.push(local);
            }
        }
    });
    result.sort();
    res.json({
        ok: true,
        result
    });
});
exports.soloLocales = soloLocales;
const buscarLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let valor = req.query.offset;
    let valorOffset = parseInt(valor);
    const productos_rows = yield producto_1.Producto.findAndCountAll({ where: {
            estado: true,
            local: { [dist_1.Op.like]: '%' + req.query.local + '%' },
        }, limit: 10, offset: valorOffset });
    let contador = productos_rows.count;
    let ids_productos = [];
    productos_rows.rows.map(e => {
        ids_productos.push(e.id);
    });
    const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos } });
    let productos = [];
    productos_rows.rows.forEach(e => {
        let tallesNew = talles.filter(i => { var _a; return (_a = i.id_producto == e.id) !== null && _a !== void 0 ? _a : i; });
        productos = [...productos, { productos: e, talles: tallesNew }];
    });
    res.json({
        ok: true,
        contador,
        productos,
    });
});
exports.buscarLocal = buscarLocal;
const cambiarProductosDeLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datos = req.body;
        const productos = yield producto_1.Producto.findAll({ where: {
                estado: true,
                local: { [dist_1.Op.like]: '%' + datos.OldValue + '%' }
            } });
        for (let p of productos) {
            yield p.update({ local: datos.NewValue });
        }
        res.json({
            ok: true,
            msg: "Bien!!"
        });
    }
    catch (error) {
        res.json({ ok: false, msg: error });
    }
});
exports.cambiarProductosDeLocal = cambiarProductosDeLocal;
const buscarProductosDoble = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let valor = req.query.offset;
    let valorOffset = parseInt(valor);
    let valorID = req.query.usuario;
    let valorBusqueda = req.query.local;
    const productos_rows = yield producto_1.Producto.findAndCountAll({ where: {
            estado: true,
            local: { [dist_1.Op.like]: '%' + valorBusqueda + '%' },
            [dist_1.Op.or]: [
                {
                    nombre: { [dist_1.Op.like]: '%' + req.query.nombre + '%' }
                },
                {
                    id: { [dist_1.Op.like]: '%' + req.query.nombre + '%' }
                }
            ]
        }, limit: 10, offset: valorOffset });
    /*   const productos_rows = await Producto.findAndCountAll({ where:{
          estado:true,
          nombre:{ [Op.like]: '%'+ req.query.nombre +'%'},
          id:{ [Op.like]: '%'+ req.query.nombre +'%'}
          
      }, limit:10, offset:valorOffset} );
     */
    let contador = productos_rows.count;
    let ids_productos = [];
    productos_rows.rows.map(e => {
        ids_productos.push(e.id);
    });
    const talles = yield talles_1.Talle.findAll({ where: { id_producto: ids_productos } });
    let productos = [];
    productos_rows.rows.forEach(e => {
        let tallesNew = talles.filter(i => { var _a; return (_a = i.id_producto == e.id) !== null && _a !== void 0 ? _a : i; });
        productos = [...productos, { productos: e, talles: tallesNew }];
    });
    res.json({
        ok: true,
        contador,
        productos
    });
});
exports.buscarProductosDoble = buscarProductosDoble;
//# sourceMappingURL=producto.js.map