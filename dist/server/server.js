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
const direccion_1 = __importDefault(require("../routers/ventas/direccion"));
const talle_1 = __importDefault(require("../routers/ventas/talle"));
const historial_1 = __importDefault(require("../routers/ventas/historial"));
const orden_detalle_1 = __importDefault(require("../routers/ventas/orden_detalle"));
//PRODUCION
const producto_produccion_1 = __importDefault(require("../routers/produccion/producto_produccion"));
const historial_2 = __importDefault(require("../routers/produccion/historial"));
const taller_1 = __importDefault(require("../routers/produccion/taller"));
const estanpados_1 = __importDefault(require("../routers/produccion/estanpados"));
const rollos_1 = __importDefault(require("../routers/produccion/rollos"));
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
            direccion: '/api/direccion',
            talle: '/api/talle',
            historial: '/api/historial',
            ordenDetalle: '/api/ordenDetalle',
            //PRODUCCION
            producto_producto: '/api/produccion/producto_produccion',
            taller: '/api/produccion/taller',
            hisorial: '/api/produccion/hisorial',
            estanpado: '/api/produccion/estanpado',
            rollos: '/api/produccion/rollos',
        };
        this.app = (0, express_1.default)();
        this.port = '8000';
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
        this.app.use((0, cors_1.default)());
        this.app.use((req, res, next) => {
            // Dominio que tengan acceso (ej. 'http://example.com')
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });
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
        this.app.use(this.apiPaths.direccion, direccion_1.default);
        this.app.use(this.apiPaths.talle, talle_1.default);
        this.app.use(this.apiPaths.historial, historial_1.default);
        this.app.use(this.apiPaths.ordenDetalle, orden_detalle_1.default);
        //PRODUCCION
        this.app.use(this.apiPaths.producto_producto, producto_produccion_1.default);
        this.app.use(this.apiPaths.taller, taller_1.default);
        this.app.use(this.apiPaths.hisorial, historial_2.default);
        this.app.use(this.apiPaths.estanpado, estanpados_1.default);
        this.app.use(this.apiPaths.rollos, rollos_1.default);
    }
    listen() {
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`));
    }
}
exports.default = ServerApp;
//# sourceMappingURL=server.js.map