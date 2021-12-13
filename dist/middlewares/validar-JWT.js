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
exports.validarJWT_Parmans_ID = exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const usuario_1 = require("../models/ventas/usuario");
dotenv_1.default.config();
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        const usuarios = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || '');
        if (usuarios.id == 0 || usuarios.id == '0') {
            req.params = usuarios.id;
            return next();
        }
        // leer el usuario que corresponde al uid
        const usuario = yield usuario_1.Usuario.findByPk(usuarios.id);
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: 'token no valido - usuario no existe DB'
            });
        }
        // verificar si el uid tiene estado esta en true
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'token no valido'
            });
        }
        /* console.log(usuario) */
        //req.params = usuario; 
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'el token no es el correcto'
        });
    }
});
exports.validarJWT = validarJWT;
const validarJWT_Parmans_ID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        const usuarios = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || '');
        if (usuarios.id == 0 || usuarios.id == '0') {
            req.params = usuarios.id;
            return next();
        }
        // leer el usuario que corresponde al uid
        const usuario = yield usuario_1.Usuario.findByPk(usuarios.id);
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: 'token no valido - usuario no existe DB'
            });
        }
        // verificar si el uid tiene estado esta en true
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'token no valido'
            });
        }
        req.params = usuario;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'el token no es el correcto'
        });
    }
});
exports.validarJWT_Parmans_ID = validarJWT_Parmans_ID;
//# sourceMappingURL=validar-JWT.js.map