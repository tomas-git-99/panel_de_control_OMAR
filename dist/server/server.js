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
class ServerApp {
    constructor() {
        this.apiPaths = {
            //VENTAS
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            sala: '/api/sala',
            //PRODUCCION
        };
        this.app = (0, express_1.default)();
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
                //await db.authenticate();
                console.log('base de datos conectada');
            }
            catch (error) {
                throw new Error("error" + error);
            }
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    router() {
        this.app.use(this.apiPaths.usuarios);
    }
    listen() {
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`));
    }
}
exports.default = ServerApp;
//# sourceMappingURL=server.js.map