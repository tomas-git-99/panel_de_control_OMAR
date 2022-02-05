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
exports.filtroPorFechas = exports.buscarPorLocal = exports.buscarLocales = void 0;
const dist_1 = require("sequelize/dist");
const cliente_1 = require("../../models/ventas/cliente");
const direccion_1 = require("../../models/ventas/direccion");
const orden_1 = require("../../models/ventas/orden");
const usuario_1 = require("../../models/ventas/usuario");
const buscarLocales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locales = yield usuario_1.Usuario.findAll();
    let local = [];
    locales.map(e => {
        if (e.local !== null) {
            local.push(e.local);
        }
    });
    res.json({
        ok: true,
        local
    });
});
exports.buscarLocales = buscarLocales;
const buscarPorLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { local } = req.params;
        const locales = yield usuario_1.Usuario.findAll({ where: { local: local } });
        let ids_local = [];
        locales.map(e => {
            ids_local.push(e.id);
        });
        let id_cliente = [];
        let id_direccion = [];
        let valor = req.query.offset;
        let valorOffset = parseInt(valor);
        const orden = yield orden_1.Orden.findAndCountAll({ where: { id_usuario: ids_local, total: { [dist_1.Op.gt]: 0 } }, order: [['updatedAt', 'DESC']], limit: 10, offset: valorOffset });
        let contador = orden.count;
        orden.rows.map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
            id_cliente.push(e.id_cliente);
            id_direccion.push(e.id_direccion);
        }));
        const cliente = yield cliente_1.Cliente.findAll({ where: { id: id_cliente } });
        const direccion = yield direccion_1.Direccion.findAll({ where: { id: id_direccion } });
        let datos = [];
        for (let i of orden.rows) {
            let newcliente = cliente.find(e => e.id == i.id_cliente);
            let direcciones = direccion.find(h => h.id == i.id_direccion);
            datos = [...datos, { orden: i, cliente: newcliente || "", direccion: direcciones || "" }];
        }
        console.log(contador);
        res.json({
            ok: true,
            contador,
            datos
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
});
exports.buscarPorLocal = buscarPorLocal;
const filtroPorFechas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data;
        req.body.fecha[1] == undefined ? data = req.body.fecha[0] : data = { [dist_1.Op.between]: [req.body.fecha[0], req.body.fecha[1]] };
        /*  new Date(req.body.fecha[1]), new Date(req.body.fecha[1]) */
        //let valor = {[Op.between]:[req.body.fecha[0], req.body.fecha[1]]}
        let buscar = {
            where: {}, order: [['createdAt', 'DESC']]
        };
        console.log(data);
        let local = req.query.local == undefined ? '' : req.query.local;
        buscar.where[`createdAt`] = '2022-02-01';
        /*  buscar.where[`id_usuario`] = {[Op.like]: '%'+ local +'%'}; */
        //buscar.where['fecha'] = {[Op.like]: {[Op.any]: data}};
        const orden = yield orden_1.Orden.findAndCountAll({ where: { createdAt: { [dist_1.Op.like]: { [dist_1.Op.any]: ['2022-02-01'] } } } });
        /*     let id_cliente:any = []
            let id_direccion:any = []
            
            orden.rows.map(async(e, i)=> {
                id_cliente.push(e.id_cliente);
                id_direccion.push(e.id_direccion);
            });
            const cliente = await Cliente.findAll({where:{id:id_cliente}});
        
            const direccion = await Direccion.findAll({where:{id:id_direccion}});
            
            let datos:any = [];
        
            for ( let i of orden.rows){
            
                let newcliente = cliente.find( e => e.id == i.id_cliente);
                let direcciones = direccion.find( h => h.id == i.id_direccion);
            
                datos = [...datos,{orden:i, cliente:newcliente || "", direccion:direcciones || ""}];
            
            } */
        res.json({
            ok: true,
            orden
        });
    }
    catch (error) {
    }
});
exports.filtroPorFechas = filtroPorFechas;
const filtroFechaHistorial = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let buscar = {
        where: {}, order: [['createdAt', 'DESC']]
    };
    buscar.where[`createdAt`] = data;
    const orden = yield orden_1.Orden.findAll(buscar);
    return orden;
});
//# sourceMappingURL=historial.js.map