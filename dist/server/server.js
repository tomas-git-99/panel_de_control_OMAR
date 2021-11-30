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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//MIS IMPORTACIONES
const cliente_1 = __importDefault(require("../routers/ventas/cliente"));
const usuario_1 = __importDefault(require("../routers/ventas/usuario"));
const orden_1 = __importDefault(require("../routers/ventas/orden"));
const producto_1 = __importDefault(require("../routers/ventas/producto"));
const carrito_1 = __importDefault(require("../routers/ventas/carrito"));
const conectarDB_1 = __importDefault(require("../DB/conectarDB"));
class ServerApp {
    constructor() {
        this.apiPaths = {
            //VENTAS
            usuario: '/api/usuario',
            cliente: '/api/cliente',
            orden: '/api/orden',
            producto: '/api/producto',
            carrito: '/api/carrito',
        };
        this.app = express_1.default();
        this.port = process.env.PORT || '8000';
        /* middleware */
        this.middlewares();
        /* base de datos */
        this.dbConencion();
        /* Definnir routas */
        this.router();
    }
    dbConencion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield conectarDB_1.default.authenticate();
                console.log('Base de datos conectado');
            }
            catch (error) {
                throw new Error("error" + error);
            }
        });
    }
    middlewares() {
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    router() {
        //VENTAS
        this.app.use(this.apiPaths.usuario, usuario_1.default);
        this.app.use(this.apiPaths.cliente, cliente_1.default);
        this.app.use(this.apiPaths.orden, orden_1.default);
        this.app.use(this.apiPaths.producto, producto_1.default);
        this.app.use(this.apiPaths.carrito, carrito_1.default);
        //PRODUCCION
    }
    listen() {
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`));
    }
}
exports.default = ServerApp;
//# sourceMappingURL=server.js.map