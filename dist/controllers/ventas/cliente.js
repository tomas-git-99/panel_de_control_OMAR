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
exports.editarCliente = exports.buscarCliente = exports.crearCliente = void 0;
const cliente_1 = require("../../models/ventas/cliente");
const crearCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido, dni_cuil, tel_cel, direccion, cp, provincia, localidad } = req.body;
        const datos = {
            nombre,
            apellido,
            dni_cuil,
            tel_cel,
            direccion,
            cp,
            provincia,
            localidad,
        };
        console.log(datos);
        const cliente = new cliente_1.Cliente(datos);
        yield cliente.save();
        res.json({
            ok: true,
            cliente
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.crearCliente = crearCliente;
const buscarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buscarCliente = req.query;
    console.log(buscarCliente);
    //const cliente = await Cliente.findAll({ where:{ dni_cuil:{ [Op.like]: '%' + buscarCliente + '%'} }});
    const cliente = yield cliente_1.Cliente.findAll({ where: { dni_cuil: buscarCliente.dni_cuil } });
    res.json({
        ok: true,
        cliente
    });
});
exports.buscarCliente = buscarCliente;
const editarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const cliente = yield cliente_1.Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({
                ok: false,
                msg: `El cliente con el id ${id} no existe`
            });
        }
        yield cliente.update(body);
        res.json({
            ok: true,
            cliente
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.editarCliente = editarCliente;
//# sourceMappingURL=cliente.js.map