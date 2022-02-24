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
exports.eliminarEstampado = exports.buscarEstampados = exports.buscarEstapados = exports.obtenerEstanpadorID = exports.nuevoEstanpador = exports.getEstanpadores = exports.cambiarEstanpado = exports.obtenerEstanpados = void 0;
const dist_1 = require("sequelize/dist");
const estanpador_1 = require("../../models/produccion/estanpador");
const estanpados_1 = require("../../models/produccion/estanpados");
const productos_produccion_1 = require("../../models/produccion/productos_produccion");
const obtenerEstanpados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estanpado = yield estanpados_1.Estanpados.findAll({ order: [['createdAt', 'DESC']] });
        let ids = [];
        let ids_estanpador = [];
        estanpado.map(e => {
            ids.push(e.id_corte);
            ids_estanpador.push(e.id_estanpador);
        });
        const producto = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_corte: ids }, order: [['createdAt', 'DESC']] });
        //const producto:any = await Produccion_producto.sequelize?.query(`SELECT  * FROM producto_produccion WHERE id_corte IN (:idsP) ORDER BY id_corte * 1 DESC, id_corte DESC;`,{ replacements: {idsP:ids},type: QueryTypes.SELECT });
        const estanpador = yield estanpador_1.Estanpador.findAll({ where: { id: ids_estanpador } });
        let data = [];
        for (let i of estanpado) {
            let productoNew = producto.find((e) => e.id_corte == i.id_corte);
            let estanpadorNew = estanpador.find(e => e.id == i.id_estanpador);
            data = [...data, { producto: productoNew || "", estanpado: i, estanpador: estanpadorNew || "" }];
        }
        res.json({
            ok: true,
            data
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerEstanpados = obtenerEstanpados;
const cambiarEstanpado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield estanpados_1.Estanpados.findByPk(id);
        yield (producto === null || producto === void 0 ? void 0 : producto.update(req.body));
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
exports.cambiarEstanpado = cambiarEstanpado;
const getEstanpadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const estanpador = yield estanpador_1.Estanpador.findAll();
    res.json({
        ok: true,
        estanpador
    });
});
exports.getEstanpadores = getEstanpadores;
const nuevoEstanpador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estanpador = new estanpador_1.Estanpador(req.body);
        yield estanpador.save();
        res.json({
            ok: true,
            estanpador,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.nuevoEstanpador = nuevoEstanpador;
const obtenerEstanpadorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const estanpados = yield estanpados_1.Estanpados.findByPk(id);
        const estanpador = yield estanpador_1.Estanpador.findByPk(estanpados === null || estanpados === void 0 ? void 0 : estanpados.id_estanpador);
        const producto = yield productos_produccion_1.Produccion_producto.findAll({ where: { id_corte: estanpados === null || estanpados === void 0 ? void 0 : estanpados.id_corte } });
        res.json({
            ok: true,
            estanpados,
            estanpador: estanpador || "",
            producto: producto[0]
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.obtenerEstanpadorID = obtenerEstanpadorID;
const buscarEstapados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { valor } = req.body;
    const { query } = req.params;
    searchFunc(query, valor)
        .then(data => {
        res.json({
            ok: true,
            data
        });
    })
        .catch(error => {
        res.json({
            ok: false,
            msg: error
        });
    });
});
exports.buscarEstapados = buscarEstapados;
const searchFunc = (palabra, valor) => __awaiter(void 0, void 0, void 0, function* () {
    let buscar = {
        where: {}, order: [['updatedAt', 'DESC']]
    };
    buscar.where[`${palabra}`] = valor;
    /*     const produccion_productos = await Estanpados.findAll(buscar);
        
        const taller = await Estanpador.findAll() */
    const estanpado = yield estanpados_1.Estanpados.findAll(buscar);
    const estanpador = yield estanpador_1.Estanpador.findAll();
    const producto = yield productos_produccion_1.Produccion_producto.findAll();
    let data = [];
    for (let i of estanpado) {
        let productoNew = producto.find(h => h.id_corte == i.id_corte);
        let estanpadorNew = estanpador.find(e => e.id == i.id_estanpador);
        data = [...data, { estanpado: i, estanpador: estanpadorNew || "", producto: productoNew }];
    }
    /*
             estanpado.map ( (e, i) =>{
                estanpador.map ( (p,m) => {
                     if(e.id_estanpador == p.id){
    
                        let productoNew = producto.find( h => h.id_corte == e.id_corte);
    
                        data = [...data, {estanpado:e, estanpador:p, producto:productoNew}];
                     }
        
                 })
       
             }) */
    return data;
});
const buscarEstampados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dato = req.query;
        const produccion_productos = yield productos_produccion_1.Produccion_producto.findAll({ where: {
                nombre: { [dist_1.Op.like]: '%' + dato.nombre + '%' },
            } });
        let ids = [];
        produccion_productos.map(e => {
            ids.push(e.id_corte);
        });
        const estanpado = yield estanpados_1.Estanpados.findAll({ where: { id_corte: ids } });
        const estanpador = yield estanpador_1.Estanpador.findAll();
        let data = [];
        for (let i of estanpado) {
            let productoNew = produccion_productos.find(h => h.id_corte == i.id_corte);
            let estanpadorNew = estanpador.find(e => e.id == i.id_estanpador);
            data = [...data, { estanpado: i, estanpador: estanpadorNew || "", producto: productoNew }];
        }
        res.json({
            ok: true,
            data
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.buscarEstampados = buscarEstampados;
const eliminarEstampado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const estanpado = yield estanpados_1.Estanpados.findByPk(id);
        yield estanpado.destroy();
        res.json({
            ok: true,
            msg: 'Eliminado'
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.eliminarEstampado = eliminarEstampado;
//# sourceMappingURL=estanpados.js.map