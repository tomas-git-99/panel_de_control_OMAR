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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.eliminarUsuario = exports.editarUsuario = exports.crearUsuario = exports.login = void 0;
const usuario_1 = require("../../models/ventas/usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_JWT_1 = require("../../helpers/generar-JWT");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dni_cuil, password } = req.body;
        const usuario = yield usuario_1.Usuario.findAll({ where: { dni_cuil: dni_cuil } });
        if (!usuario) {
            return res.json({
                ok: false,
                fallo: 1,
                msg: 'Usuario / Password no son correctos'
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, usuario[0].password);
        if (!validPassword) {
            return res.json({
                ok: false,
                fallo: 3,
                msg: 'Usuario / Password no son correctos'
            });
        }
        const token = yield (0, generar_JWT_1.generarJWT)(usuario[0].id);
        res.json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'hable con el administrador',
            error: error
        });
    }
});
exports.login = login;
const crearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email, password, dni_cuil, rol } = req.body;
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const newPassword = yield bcryptjs_1.default.hashSync(password, salt);
        const datos = {
            nombre,
            email,
            password: newPassword,
            dni_cuil,
            rol,
        };
        const usuario = new usuario_1.Usuario(datos);
        yield usuario.save();
        res.json({
            ok: true,
            usuario
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.crearUsuario = crearUsuario;
const editarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const usuario = yield usuario_1.Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: `El usuario con el id ${id} no existe`
            });
        }
        //aca colocar por estado
        /*         if (!usuario){
                    return res.status(404).json({
                        ok: false,
                        msg:`El usuario no existe`
        
                    });
                } */
        yield usuario.update(body);
        res.json({
            ok: true,
            usuario
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
});
exports.editarUsuario = editarUsuario;
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.Usuario.findByPk(id);
    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.estado)) {
        return res.status(400).json({
            ok: false,
            msg: `El usuario ${usuario === null || usuario === void 0 ? void 0 : usuario.nombre} no existe en la base de datos`
        });
    }
    usuario.estado = false;
    yield usuario.save();
    res.json({
        ok: true,
        msg: `El usuario ${usuario === null || usuario === void 0 ? void 0 : usuario.nombre} fue eliminado con exito`
    });
});
exports.eliminarUsuario = eliminarUsuario;
const verificarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = req.params;
        res.json({
            ok: true,
            usuario
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        });
    }
});
exports.verificarToken = verificarToken;
//# sourceMappingURL=usuario.js.map